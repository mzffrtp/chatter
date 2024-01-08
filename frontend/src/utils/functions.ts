type FormJsonReturnType = {
  [k: string]: FormDataEntryValue | number;
};
export function formJson<T extends FormJsonReturnType>(
  formElement: EventTarget & HTMLFormElement
): T {
  const data = new FormData(formElement);
  const value = Object.fromEntries(data.entries());

  return value as T;
}
