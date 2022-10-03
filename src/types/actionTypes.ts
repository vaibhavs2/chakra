import { MyFormData } from "./formTypes";

export interface ActionAddForm {
  type: "ADD_FORM";
  payload: {
    form: Array<MyFormData> | MyFormData;
  };
}

export interface DeleteForm {
  type: "DELETE_FORM";
  payload: {
    formId: string;
  };
}

export interface UpdateForm {
  type: "UPDATE_FORM";
  payload: MyFormData;
}

export type FormActions = UpdateForm | DeleteForm | ActionAddForm;
