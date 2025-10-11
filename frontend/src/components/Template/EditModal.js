import React, { useState } from "react";
import { GripVertical } from "lucide-react";
import { formatFieldName } from "../../utils/field_manipulation.js";
import {
  ScrollArea,
  Stack,
  Paper,
  Text,
  Group,
  Checkbox,
  Divider,
  Button,
  Badge,
  Modal
} from "@mantine/core";

import { editTemplate } from "../../utils/api.js";

// Edit Modal Component
export const EditModal = ({
  isOpen,
  onClose,
  templateName,
  initialFields,
  organizedFields,
  setColumnOrder,
  onSave,
}) => {
  const [selectedFields, setSelectedFields] = useState(initialFields);
  const [fieldOrder, setFieldOrder] = useState(initialFields);
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleField = (field) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        setFieldOrder((order) => order.filter((f) => f !== field));
        return prev.filter((f) => f !== field);
      } else {
        setFieldOrder((order) => [...order, field]);
        return [...prev, field];
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newOrder = [...fieldOrder];
    const draggedField = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, draggedField);

    setFieldOrder(newOrder);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSave = () => {
    editTemplate(templateName, fieldOrder);
    setColumnOrder(fieldOrder);
    onSave(fieldOrder);
    onClose();
  };

  const handleCancel = () => {
    setSelectedFields(initialFields);
    setFieldOrder(initialFields);
    onClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleCancel}
      title={`Edit Template: ${templateName}`}
      size="xl"
      padding="xl"
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}
      >
        {/* Field Selection */}
        <ScrollArea style={{ height: "500px" }} type="auto">
          <Stack spacing="md">
            <Text size="sm" weight={600} color="dimmed" transform="uppercase">
              Select Fields
            </Text>
            {Object.entries(organizedFields).map(([group, fields]) => (
              <Paper key={group} p="md" withBorder>
                <Text size="sm" weight={500} mb="sm">
                  {formatFieldName(group)}
                </Text>
                <Stack spacing="xs">
                  {fields.map((field) => (
                    <Checkbox
                      key={field}
                      label={formatFieldName(field)}
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                    />
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        {/* Field Order */}
        <div>
          <Group position="apart" mb="sm">
            <Text size="sm" weight={600} color="dimmed" transform="uppercase">
              Field Order
            </Text>
            <Badge>{fieldOrder.length}</Badge>
          </Group>
          <Paper
            p="sm"
            withBorder
            style={{ height: "500px", overflow: "auto" }}
          >
            {fieldOrder.length === 0 ? (
              <Text
                size="sm"
                color="dimmed"
                align="center"
                style={{ paddingTop: "40px" }}
              >
                No fields selected
              </Text>
            ) : (
              <Stack spacing="xs">
                {fieldOrder.map((field, index) => (
                  <Paper
                    key={field}
                    p="xs"
                    withBorder
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor: "move",
                      opacity: draggedItem === index ? 0.5 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Group spacing="xs">
                      <GripVertical size={16} color="gray" />
                      <Text size="sm" style={{ flex: 1 }}>
                        {formatFieldName(field)}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </div>
      </div>

      <Divider my="lg" />

      {/* Actions */}
      <Group position="right" spacing="sm">
        <Button variant="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </Group>
    </Modal>
  );
};
