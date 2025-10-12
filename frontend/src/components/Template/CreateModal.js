import React, { useState } from "react";
import { GripVertical, Scroll } from "lucide-react";
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
  Modal,
  TextInput,
} from "@mantine/core";

import { createTemplate } from "../../utils/api.js";

// Create Modal Component
export const CreateModal = ({
  isOpen,
  onClose,
  templateName,
  initialFields,
  setTemplateName,
  organizedFields,
  templates,
  setTemplates,
  setFields,
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
    createTemplate(templateName, fieldOrder);
    setTemplates([...templates, { name: templateName, fields: fieldOrder }]);
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
      title="Create Template"
      size="xl"
      padding="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          height: "70vh",
        }}
      >
        {/* Template Name Input */}
        <TextInput
          label="Template Name"
          placeholder="Enter template name"
          value={templateName}
          onChange={(event) => setTemplateName(event.currentTarget.value)}
          required
          size="sm"
          style={{ marginBottom: "16px" }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            marginBottom: "8px",
          }}
        >
          {/* Field Selection */}
          <ScrollArea
            style={{ height: "100%", maxHeight: "400px" }}
            type="auto"
          >
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
          <ScrollArea
            style={{ height: "100%", maxHeight: "400px" }}
            type="auto"
          >
            <Stack spacing="md">
              <Group position="apart" mb="sm">
                <Text
                  size="sm"
                  weight={600}
                  color="dimmed"
                  transform="uppercase"
                >
                  Field Order
                </Text>
                <Badge>{fieldOrder.length}</Badge>
              </Group>
              <Paper p="sm" withBorder>
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
            </Stack>
          </ScrollArea>
        </div>

        {/* Actions */}
        <Group
          position="right"
          spacing="sm"
          style={{
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </div>
    </Modal>
  );
};
