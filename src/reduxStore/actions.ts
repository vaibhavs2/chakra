import { ActionAddForm, DeleteForm, UpdateForm } from "../types/actionTypes";
import { MyFormData } from "../types/formTypes";

export const actionAddForm =(form:Array<MyFormData> | MyFormData):ActionAddForm => ({
    type: "ADD_FORM",
    payload: {form}
  });
  export const actionDeleteForm =(formId:string):DeleteForm=> ({
    type: "DELETE_FORM",
    payload: {formId}
  });
  export const actionUpdateForm =(form:MyFormData):UpdateForm=> ({
    type: "UPDATE_FORM",
    payload: form
  });