import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

export function showSwal(type: SweetAlertIcon, message: string) {
  withReactContent(Swal).fire({
    title: type.toUpperCase(),
    text: message,
    icon: type,
  });
}
