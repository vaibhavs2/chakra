import { FormActions } from "../types/actionTypes";

import { MyFormData } from "../types/formTypes";

export type AllFormInitialState = Array<MyFormData>;
const initialState: AllFormInitialState = [];

export default (
  state = initialState,
  action: FormActions
): AllFormInitialState => {
  switch (action.type) {
    case "ADD_FORM":
      if (Array.isArray(action.payload.form)) {
        return action.payload.form;
      }
      return [action.payload.form, ...state];
    case "DELETE_FORM":
      return state.filter((form) => form.id != action.payload.formId);
    case "UPDATE_FORM":
      return state.map((form) =>
        form.id == action.payload.id ? action.payload : form
      );
    default:
      return state;
  }
};
