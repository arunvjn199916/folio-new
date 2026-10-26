"use client";

import { createContext, useContext, useId } from "react";
import { Slot } from "radix-ui";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import type { z } from "zod";
import { Label } from "./primitives";
import { cn } from "@/lib/utils";

// shadcn Form: react-hook-form + zod, with labels, descriptions and errors wired to
// aria-describedby / aria-invalid automatically.

/** Minimal zod → react-hook-form resolver (avoids @hookform/resolvers' peer-dependency tangle). */
export function zodResolver<T extends z.ZodType<FieldValues>>(schema: T): Resolver<z.infer<T>> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: result.data, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors } as never;
  };
}

export const Form = FormProvider;

const FieldContext = createContext<{ name: string }>({ name: "" });
const ItemContext = createContext<{ id: string }>({ id: "" });

export function FormField<TValues extends FieldValues, TName extends FieldPath<TValues>>(props: ControllerProps<TValues, TName>) {
  return (
    <FieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FieldContext.Provider>
  );
}

function useFormField() {
  const field = useContext(FieldContext);
  const { id } = useContext(ItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: field.name });
  const state = getFieldState(field.name, formState);
  return { id, name: field.name, controlId: `${id}-control`, descriptionId: `${id}-description`, messageId: `${id}-message`, ...state };
}

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = useId();
  return (
    <ItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </ItemContext.Provider>
  );
}
export function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, controlId } = useFormField();
  return <Label data-error={!!error} className={cn("data-[error=true]:text-ds-destructive", className)} htmlFor={controlId} {...props} />;
}
export function FormControl(props: React.ComponentProps<typeof Slot.Root>) {
  const { error, controlId, descriptionId, messageId } = useFormField();
  return <Slot.Root id={controlId} aria-describedby={error ? `${descriptionId} ${messageId}` : descriptionId} aria-invalid={!!error} {...props} />;
}
export function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useFormField();
  return <p id={descriptionId} className={cn("text-sm text-ds-muted-foreground", className)} {...props} />;
}
export function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, messageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return null;
  return (
    <p id={messageId} role="alert" className={cn("text-sm text-ds-destructive", className)} {...props}>
      {body}
    </p>
  );
}
