import React, { useMemo } from "react";
import { Check } from "react-feather";
import { Stack, Paper, Text, Group, Modal } from "@mantine/core";
import { formatFieldName } from "../../utils/field_manipulation.js";

// View Modal Component
export const ViewModal = ({
  isOpen,
  onClose,
  templateName,
  selectedFields,
  organizedFields,
}) => {
  const groupedSelectedFields = useMemo(() => {
    console.log("Modal opened for template:", templateName);
    const grouped = {};
    Object.entries(organizedFields).forEach(([group, fields]) => {
      const selected = fields.filter((f) => selectedFields.includes(f));
      if (selected.length > 0) {
        grouped[group] = selected;
      }
    });
    return grouped;
  }, [selectedFields, organizedFields]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`View Template: ${templateName}`}
      size="lg"
      padding="xl"
    >
      <Stack spacing="md">
        {Object.entries(groupedSelectedFields).map(([group, fields]) => (
          <Paper key={group} p="md" withBorder>
            <Text
              size="sm"
              weight={600}
              color="dimmed"
              transform="uppercase"
              mb="sm"
            >
              {formatFieldName(group)}
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {fields.map((field) => (
                <Group key={field} spacing="xs">
                  <Check size={16} color="green" />
                  <Text size="sm">{formatFieldName(field)}</Text>
                </Group>
              ))}
            </div>
          </Paper>
        ))}
      </Stack>
    </Modal>
  );
};
