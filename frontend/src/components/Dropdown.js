// Dropdown.js
import React, { useState, useEffect } from "react";
import {
  Menu,
  Button,
  TextInput,
  ScrollArea,
  ActionIcon,
  Group,
  Text,
  Divider,
  Box,
} from "@mantine/core";
import { IconTrash, IconChevronDown } from "@tabler/icons-react";
import {
  addCategory,
  addWatchlist,
  removeCategory,
  removeWatchlist,
} from "../utils/api";

export default function Dropdown({
  dropdownType = "Dropdown", // label above dropdown
  items = [], // array of items (strings or objects)
  itemKey = (it) => it, // function to get unique key from item
  itemLabel = (it) => it, // function to get display label from item
  placeholder = "Select...",
  categoryChange = () => {},
  onSelect = () => {}, // called with selected item
  onAdd = () => {}, // called with newItemString
  onRemove = () => {}, // called with item (or its key)
  setCurrentWatchlist = () => {},
  currentCategory = null,
  setCompanies = () => {},
  maxHeight = 200,
}) {
  const [opened, setOpened] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [selected, setSelected] = useState(placeholder);

  // Update selected when placeholder changes
  useEffect(() => {
    setSelected(placeholder);
  }, [placeholder]);

  const handleSelect = async (item) => {
    setCompanies([]);
    if (dropdownType === "Category") {
      categoryChange(item);
    } else {
      setCurrentWatchlist(item);
    }
    setSelected(item);
    onSelect(item);
    setOpened(false);
  };

  const handleAdd = async () => {
    const trimmed = (newValue || "").trim();
    if (!trimmed) return;
    onAdd(trimmed);
    if (dropdownType === "Watchlist") {
      await addWatchlist(currentCategory, trimmed);
    } else {
      await addCategory(trimmed);
    }
    setNewValue("");
  };

  const handleRemove = async (item) => {
    onRemove(item);
    // if removed item was selected, clear selection
    if (selected && itemKey(selected) === itemKey(item)) {
      setSelected(null);
      onSelect(null);
    }
    if (dropdownType === "Watchlist") {
      await removeWatchlist(currentCategory, item);
    } else {
      await removeCategory(item);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text mb="sm">{dropdownType}</Text>
        <Menu
          shadow="md"
          width={280}
          onClose={() => setOpened(false)}
          onOpen={() => setOpened(true)}
        >
          <Menu.Target>
            <Button
              rightIcon={<IconChevronDown size={16} />}
              onClick={() => setOpened((o) => !o)}
              variant="outline"
              style={{
                width: "280px", // fixed width
                justifyContent: "left", // keeps label left, icon right
                textAlign: "center",
              }}
            >
              {selected}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Box px="sm" py="xs">
              <Group position="apart" spacing="xs" style={{ width: "100%" }}>
                <TextInput
                  placeholder="Add new..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                  }}
                  style={{ flex: 1 }}
                  size="sm"
                />
                <Button size="sm" onClick={handleAdd}>
                  Add
                </Button>
              </Group>
            </Box>

            <Divider />

            <ScrollArea style={{ height: Math.min(maxHeight, 260) }}>
              {items.length === 0 ? (
                <Box p="sm">
                  <Text size="sm" color="dimmed">
                    No items
                  </Text>
                </Box>
              ) : (
                items.map((it) => {
                  const key = itemKey(it);
                  const label = itemLabel(it);
                  const isSelected = selected && itemKey(selected) === key;
                  return (
                    <>
                      <Menu.Item
                        key={String(key)}
                        onClick={() => handleSelect(it)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          backgroundColor: isSelected
                            ? "rgba(0,0,0,0.03)"
                            : undefined,
                          padding: "6px 10px",
                        }}
                      >
                        <Group
                          spacing="xs"
                          position="right"
                          style={{ flexShrink: 0 }}
                        >
                          <Text
                            size="sm"
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {label}
                          </Text>
                          <Button
                            size="xs"
                            variant={isSelected ? "filled" : "outline"}
                            color={isSelected ? "blue" : "gray"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(it);
                            }}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>

                          <ActionIcon
                            color="red"
                            variant="light"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(it);
                            }}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Menu.Item>
                    </>
                  );
                })
              )}
            </ScrollArea>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}
