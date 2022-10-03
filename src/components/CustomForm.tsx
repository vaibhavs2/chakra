import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
  HStack,
  Button,
  VStack,
  useToast,
  UseToastOptions,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createNewForm,
  deleteForm,
  getAllForms,
  getFormById,
  updateForm,
} from "../APIs/formAPIs";
import { AllFormInitialState } from "../reduxStore/reducers";
import { MyFormData } from "../types/formTypes";
import { validateEmail } from "../utils";
import DefaultScreenWrapper from "./DefaultScreenWrapper";

const defaultFormData: MyFormData = {
  name: "",
  phone: "",
  email: "",
  metadata: "",
  id: "",
  createdAt: "",
  updatedAt: "",
};
export function CustomForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isInViewMode, setIsInViewMode] = useState(formId != "new");
  const [isLoading, setIsLoading] = useState("");
  const [isEditEnabled, setEnableEdit] = useState(false);
  const formDataById =
    useSelector((forms: AllFormInitialState) =>
      forms.find((form) => form.id == formId)
    ) || defaultFormData;
  const [getUserInput, setUserinput] = useState<MyFormData>(formDataById);
  const [getError, setError] = useState({ componentId: "", message: "" });

  React.useEffect(() => {
    if (isInViewMode && !formDataById.id)
      (async () => {
        const response = await getFormById(formId!);
        if (response.error) {
          toast({
            title: "Error encountered",
            description: response.message || "Encountered network error",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          setUserinput(response.data);
        }
      })();
  }, []);

  React.useEffect(() => {
    if (isInViewMode && formId == "new") {
      setIsInViewMode(false);
      setUserinput({ ...defaultFormData });
      setEnableEdit(false);
    }
  }, [formId]);

  const onInputChange = ({
    target: { id, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setError({ componentId: "", message: "" });
    setUserinput({ ...getUserInput, [id]: value });
  };
  const onDeleteForm = async () => {
    if (!formId) return;
    setIsLoading("delete");
    const response = await deleteForm(formId);
    setIsLoading("");
    toast({
      title: "Form deleted",
      description: response.message || "Encountered network error",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    navigate("/");
  };
  const onInfoSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getUserInput.name) {
      setError({ componentId: "name", message: "Your name is required" });
    } else if (!getUserInput.phone) {
      setError({ componentId: "phone", message: "Your phone is required" });
    } else if (
      !getUserInput.email ||
      (getUserInput.email && !validateEmail(getUserInput.email))
    ) {
      setError({
        componentId: "email",
        message: "Your valid email is required",
      });
    } else {
      setIsLoading("submit");
      const { id, ...restObject } = {
        ...getUserInput,
        updatedAt: new Date().toISOString(),
      };

      if (!restObject.createdAt) {
        restObject.createdAt = new Date().toISOString();
      }
      let response;
      if (isInViewMode) {
        response = await updateForm(formId!, restObject);
      } else {
        response = await createNewForm(restObject);
      }

      const toastMessage: UseToastOptions = {
        title: "Submission failed",
        description: response.message || "Encountered network error",
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      if (!response.error) {
        toastMessage.title = "Success";
        toastMessage.description = "Form submitted!";
        toastMessage.status = "success";
      }
      setIsLoading("");
      toast(toastMessage);
    }
  };

  const disableInputs = isInViewMode && !isEditEnabled;
  return (
    <DefaultScreenWrapper navIndex={isInViewMode ? 0 : 1}>
      <HStack pb={20} justifyContent="space-between">
        <VStack alignItems={"flex-start"}>
          <Text fontSize="xl">{!isInViewMode && "Fill"} Your information</Text>
          {isInViewMode && (
            <Box>
              <Text>
                Created At: {new Date(getUserInput.createdAt).toLocaleString()}
              </Text>
              <Text>
                Last updated At:{" "}
                {new Date(getUserInput.updatedAt).toLocaleString()}
              </Text>
            </Box>
          )}
        </VStack>

        {isInViewMode && (
          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="flex-end"
          >
            <Button
              colorScheme="blue"
              mr={{ base: 0, md: 4 }}
              mb={{ base: 3, md: 0 }}
              onClick={() => {
                setEnableEdit(!isEditEnabled);
              }}
            >
              {isLoading == "edit" ? (
                <CircularProgress isIndeterminate color="red" mx={4} size={5} />
              ) : (
                "Edit"
              )}
            </Button>
            <Button colorScheme="red" onClick={onDeleteForm}>
              {isLoading == "delete" ? (
                <CircularProgress
                  isIndeterminate
                  color="black"
                  mx={4}
                  size={5}
                />
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        )}
      </HStack>

      <form noValidate onSubmit={onInfoSubmit}>
        <FormControl
          pb={8}
          isInvalid={getError.componentId == "name"}
          isRequired
        >
          <FormLabel>Your Name</FormLabel>
          <Input
            type="text"
            onChange={onInputChange}
            id="name"
            value={getUserInput.name}
            disabled={disableInputs}
          />
          {getError.componentId == "name" && (
            <FormErrorMessage>Your name is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          pb={8}
          isInvalid={getError.componentId == "phone"}
          isRequired
        >
          <FormLabel>Your mobile number</FormLabel>
          <InputGroup>
            <InputLeftAddon children="+91" />
            <Input
              type="number"
              placeholder="phone number"
              onChange={onInputChange}
              id="phone"
              maxLength={10}
              value={getUserInput.phone}
              disabled={disableInputs}
            />
          </InputGroup>
          {getError.componentId == "phone" && (
            <FormErrorMessage>Phone is required.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          pb={8}
          isInvalid={getError.componentId == "email"}
          isRequired
        >
          <FormLabel>Your Email</FormLabel>
          <Input
            type="email"
            onChange={onInputChange}
            id="email"
            value={getUserInput.email}
            disabled={disableInputs}
          />
          {getError.componentId == "email" && (
            <FormErrorMessage>{getError.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl pb={8}>
          <FormLabel>More information you want to store</FormLabel>
          <Input
            id="metadata"
            onChange={onInputChange}
            value={getUserInput.metadata}
            disabled={disableInputs}
          />
        </FormControl>
        {!disableInputs && (
          <Box display={"flex"} justifyContent={"center"} mt={20}>
            {isLoading == "submit" ? (
              <CircularProgress isIndeterminate color="green.300" />
            ) : (
              <Input
                variant="filled"
                value={isInViewMode ? "Update" : "Submit"}
                type="submit"
                size={"md"}
                maxW={250}
                _hover={{ bg: "gray", cursor: "pointer" }}
              />
            )}
          </Box>
        )}
      </form>
    </DefaultScreenWrapper>
  );
}
