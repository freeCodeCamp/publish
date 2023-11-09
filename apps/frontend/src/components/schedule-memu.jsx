import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ScheduleMenu = ({ handleSubmit }) => {
  const [scheduleOption, setScheduleOption] = useState("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isScheduledAndDateValid =
    scheduledDate != "" && scheduledTime != "" && scheduleOption == "later";

  return (
    <Box ml="auto">
      <Menu isOpen={isOpen} onClose={onClose}>
        <MenuButton
          onClick={onOpen}
          as={Button}
          variant={"ghost"}
          rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
        >
          Publish
        </MenuButton>
        <MenuList w={"375px"}>
          <Box m={"0.75rem"}>
            <Text fontSize="lg" color="gray.500">
              Ready to publish your post?
            </Text>
          </Box>
          <MenuDivider />
          <RadioGroup
            m={"1rem 0rem 0 1rem"}
            defaultValue="now"
            value={scheduleOption}
          >
            <Stack direction={"column"}>
              <Radio
                colorScheme="blue"
                onClick={() => {
                  setScheduleOption("now");
                }}
                value="now"
              >
                <Text
                  fontWeight={"500"}
                  color={"gray.600"}
                  fontSize={"sm"}
                  onClick={() => setScheduleOption("now")}
                >
                  Set it live now
                </Text>
              </Radio>
              <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
                Post this post immediately
              </Text>
              <Spacer />
              <Radio
                colorScheme="blue"
                onClick={() => {
                  setScheduleOption("later");
                }}
                value="later"
              >
                <Text
                  fontWeight={"500"}
                  color={"gray.600"}
                  fontSize={"sm"}
                  onClick={() => setScheduleOption("later")}
                >
                  Schedule it for Later
                </Text>
              </Radio>
              <Stack direction={"row"} ml={"1.5rem"} pr={"1rem"}>
                <Input
                  type={"date"}
                  size="sm"
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
                <InputGroup size="sm">
                  <Input
                    type={"time"}
                    className="time-input"
                    size="sm"
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                  <InputRightAddon>
                    <Text fontSize={"sm"} time>
                      UTC
                    </Text>
                  </InputRightAddon>
                </InputGroup>
              </Stack>
              <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
                Set automatic future publish date
              </Text>
            </Stack>
          </RadioGroup>

          <MenuDivider />
          <Flex justifyContent={"end"} mt={"1rem"}>
            <Button
              mr="1rem"
              variant={"ghost"}
              color="gray.500"
              fontWeight={"400"}
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleSubmit(scheduleOption, scheduledDate, scheduledTime);
                onClose();
              }}
              isDisabled={!isScheduledAndDateValid && scheduleOption != "now"}
              mr="1rem"
              size="sm"
            >
              {scheduleOption == "now" ? "Publish" : "Schedule"}
            </Button>
          </Flex>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default ScheduleMenu;
