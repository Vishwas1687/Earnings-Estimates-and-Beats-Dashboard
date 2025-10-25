import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Eye, Edit, Trash2 } from "react-feather";
import { ViewModal } from "./ViewModal.js";
import { EditModal } from "./EditModal.js";
import { organizeFields } from "../../utils/field_manipulation.js";
import { applyTemplate, deleteTemplate } from "../../utils/api.js";
import { Menu, Button, Box, Text, Group, ActionIcon } from "@mantine/core";

// Main Dropdown Component
export const TemplateDropdown = ({
  currentCategory,
  currentWatchlist,
  currentTemplate,
  setCurrentTemplate,
  templateList,
  columnOrder,
  setColumnOrder,
  fieldGroups,
  fieldCategories,
  fields,
  setFields,
  categories,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewModal, setViewModal] = useState({ isOpen: false, template: null });
  const [editModal, setEditModal] = useState({ isOpen: false, template: null });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (Array.isArray(templateList)) {
      setTemplates(templateList);
    } else {
      setTemplates(
        Object.entries(templateList).map(([name, fields]) => ({
          name,
          fields,
        }))
      );
    }
  }, [templateList]);

  const organizedFields = useMemo(
    () => organizeFields(fieldGroups, fieldCategories),
    [fieldGroups, fieldCategories]
  );

  const handleSelect = (templateName) => {
    if (templateName === currentTemplate) {
      applyTemplate(null, currentCategory, currentWatchlist);
      const category = categories.find((cat) => cat.name === currentCategory);
      const watchlist = category
        ? category.watchlists.find((wl) => wl.name === currentWatchlist)
        : null;
      setFields(["name", "price", "country"]);
      setCurrentTemplate(null);
    } else {
      applyTemplate(templateName, currentCategory, currentWatchlist);
      setFields(getTemplateFields(templateName));
      setCurrentTemplate(templateName);
    }
  };

  const handleView = (templateName) => {
    setIsOpen(false);
    setViewModal({ isOpen: true, template: templateName });
  };

  const handleEdit = (templateName) => {
    setIsOpen(false);
    setEditModal({ isOpen: true, template: templateName });
  };

  const handleDelete = (templateName) => {
    setTemplates((prev) => prev.filter((t) => t.name !== templateName));
    deleteTemplate(templateName);
    if (templateName === currentTemplate) {
      setCurrentTemplate(null);
      setFields([]);
    }
  };

  const handleSave = (templateName, newFields) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.name === templateName ? { ...t, fields: newFields } : t
      )
    );
  };

  const getTemplateFields = (templateName) => {
    const template = templates.find((t) => t.name === templateName);
    return template ? template.fields : [];
  };

  return (
    <Box
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text mb="sm">Choose Template</Text>
      <Menu
        opened={isOpen}
        onChange={setIsOpen}
        width="target"
        position="bottom"
        shadow="md"
      >
        <Menu.Target>
          <Button
            fullWidth
            variant="outline"
            style={{ justifyContent: "space-between", width: "25rem" }}
          >
            {currentTemplate || "Select Template"}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {templates.length !== 0 &&
            templates.map((template) => (
              <Box key={template.name}>
                <Group
                  position="apart"
                  p="xs"
                  style={{ borderBottom: "1px solid #e9ecef" }}
                >
                  <Text size="sm" weight={500} style={{ flex: 1 }}>
                    {template.name}
                  </Text>
                  <Group spacing="xs">
                    <Button
                      size="xs"
                      compact
                      variant={
                        template.name === currentTemplate ? "filled" : "outline"
                      }
                      color={
                        template.name === currentTemplate ? "blue" : "gray"
                      }
                      onClick={() => handleSelect(template.name)}
                    >
                      {template.name === currentTemplate
                        ? "Selected"
                        : "Select"}
                    </Button>
                    <ActionIcon
                      color="blue"
                      variant="subtle"
                      onClick={() => handleView(template.name)}
                      title="View"
                    >
                      <Eye size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="green"
                      variant="subtle"
                      onClick={() => handleEdit(template.name)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDelete(template.name)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>
            ))}
        </Menu.Dropdown>
        {templates.length === 0 && (
          <Menu.Dropdown>
            <Box p="sm">
              <Text size="sm" color="dimmed">
                No templates available
              </Text>
            </Box>
          </Menu.Dropdown>
        )}
      </Menu>

      {/* View Modal */}
      {viewModal.isOpen && (
        <ViewModal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, template: null })}
          templateName={viewModal.template}
          selectedFields={getTemplateFields(viewModal.template)}
          organizedFields={organizedFields}
        />
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, template: null })}
          templateName={editModal.template}
          initialFields={getTemplateFields(editModal.template)}
          organizedFields={organizedFields}
          setFields={setFields}
          onSave={(newFields) => handleSave(editModal.template, newFields)}
        />
      )}
    </Box>
  );
};
