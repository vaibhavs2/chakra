import { MyFormData } from "../types/formTypes";
import { customDispatch } from '../reduxStore/store'
import { actionAddForm, actionDeleteForm, actionUpdateForm } from "../reduxStore/actions";


async function makeNetworkRequest(url: string, init?: RequestInit) {
  try {
    if(init?.method=='POST'|| init?.method=='PUT'){
      init.headers = {
        "Content-Type": "application/json",
      }
    }
    const connectRequest = await fetch(url, init);
    if (connectRequest.ok) {
      const response = await connectRequest.json();
      return { data: response, error:!!response.error, message: response?.message||"" };
    } else {
      throw { message: connectRequest.statusText };
    }
  } catch (error: any) {
    return { error: true, message: error.message as string, data: null };
  }
}

const baseUrl = process.env.REACT_APP_BASE_URL!;

type AllForms = Array<MyFormData>;

export async function getAllForms(): Promise<{
  error: boolean;
  message: string;
  data: AllForms;
}> {
  const url = new URL("get-all-forms", baseUrl);
  const response = await makeNetworkRequest(url.toString());
  customDispatch(actionAddForm(response.data))
  return response;
}

export async function updateForm(
  formId: string,
  data: Omit<MyFormData,'id'>
): Promise<{
  error: boolean;
  message: string;
  data: { message: string };
}> {
  const url = new URL(`/form/${formId}`, baseUrl);
  const response = await makeNetworkRequest(url.toString(), {
    method: "PUT",
    body: JSON.stringify(data),
  });
  customDispatch(actionUpdateForm({...data, id:formId}))
  return response;
}

export async function deleteForm(formId: string): Promise<{
  error: boolean;
  message: string;
  data: { message: string };
}> {
  const url = new URL(`/form/${formId}`, baseUrl);
  const response = await makeNetworkRequest(url.toString(), {
    method: "DELETE",
  });
  customDispatch(actionDeleteForm(formId))
  return response;
}

export async function getFormById(formId: string): Promise<{
  error: boolean;
  message: string;
  data: MyFormData;
}> {
  const url = new URL(`/form/${formId}`, baseUrl);
  const response = await makeNetworkRequest(url.toString());
  return response;
}

export async function createNewForm(
  data: Omit<MyFormData, 'id'>
): Promise<{
  error: boolean;
  message: string;
  data: { message: string, formId:string };
}> {
  const url = new URL(`/form`, baseUrl);
  const response = await makeNetworkRequest(url.toString(), {
    method: "POST",
    body: JSON.stringify(data),
  });
  if(!response.error){
    customDispatch(actionAddForm({...data, id:response.data.formId }))
  }
  return response;
}
