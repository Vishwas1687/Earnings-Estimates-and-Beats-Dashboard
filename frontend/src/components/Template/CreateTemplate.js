import { Button } from "@mantine/core";
import { useState, useMemo } from "react";
import { CreateModal } from "./CreateModal.js";
import { organizeFields } from "../../utils/field_manipulation.js";

export const CreateTemplate = ({
  fieldGroups,
  fieldCategories,
  templates,
  setTemplates,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [initialFields, setInitialFields] = useState([
    "name",
    "price",
    "country",
  ]);
  const organizedFields = useMemo(
    () => organizeFields(fieldGroups, fieldCategories),
    [fieldGroups, fieldCategories]
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="filled"
        size="md"
        style={{ marginTop: "2.2rem", fontSize: "0.9rem" }}
      >
        Create Template
      </Button>
      {/* Create Modal */}
      {isOpen && (
        <CreateModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          templateName={templateName}
          setTemplateName={setTemplateName}
          initialFields={initialFields}
          organizedFields={organizedFields}
          templates={templates}
          setTemplates={setTemplates}
        />
      )}
    </>
  );
};
