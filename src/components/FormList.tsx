import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllForms } from "../APIs/formAPIs";
import { AllFormInitialState } from "../reduxStore/reducers";
import DefaultScreenWrapper from "./DefaultScreenWrapper";

export function FormList() {
  const [getLoading, setLoading] = React.useState(false);
  const allForms = useSelector((state: AllFormInitialState) => state);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!allForms.length) {
      (async () => {
        setLoading(true);
        const allForms = await getAllForms();
        if (allForms.error) {
          setLoading(false);
          alert(allForms.message);
          return;
        }
        setLoading(false);
      })();
    }
  }, []);

  const navigateToFormView = (formId: string) => {
    navigate(`/${formId}`);
  };

  if (getLoading) {
    return (
      <DefaultScreenWrapper navIndex={0}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent="center"
          minH={"80vh"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      </DefaultScreenWrapper>
    );
  }
  return (
    <DefaultScreenWrapper navIndex={0}>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>
            {allForms.length ? "All forms" : "No form available"}
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Creator</Th>
              <Th>Created At</Th>
              <Th>Last updated at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allForms.map((forms) => (
              <Tr
                key={forms.id}
                onClick={() => {
                  navigateToFormView(forms.id);
                }}
                _hover={{ cursor: "pointer", bg: "gray.100" }}
              >
                <Td>{forms.name}</Td>
                <Td>{forms.createdAt}</Td>
                <Td>{forms.updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </DefaultScreenWrapper>
  );
}
