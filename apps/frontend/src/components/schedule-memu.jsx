import React, { useEffect, useState } from "react";
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

const ScheduleMenu = ({ handleSubmit, post }) => {
  const [scheduleOption, setScheduleOption] = useState("now");

  const [isPublished, setIsPublished] = useState(
    post.attributes.publishedAt != null,
  );

  const [isScheduled, setIsScheduled] = useState(
    post.attributes.scheduled_at != null,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (post) {
      const option =
        post.attributes.publishedAt != null ? "now" : "unpublished";
      setScheduleOption(option);
    }
  }, [post]);

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuButton
        onClick={onOpen}
        as={Button}
        variant={"ghost"}
        rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
      >
        {isPublished ? "Update" : isScheduled ? "Scheduled" : "Publish"}
      </MenuButton>
      <MenuList w={"375px"}>
        <Box m={"0.75rem"}>
          <Text fontSize="lg">
            {isPublished ? "Update" : "Ready to publish"} your post?
          </Text>
        </Box>
        <MenuDivider />
        {!isPublished ? (
          <NotPublishedMenu
            scheduleOption={scheduleOption}
            setScheduleOption={setScheduleOption}
            setIsPublished={setIsPublished}
            setIsScheduled={setIsScheduled}
            isScheduled={isScheduled}
            isPublished={isPublished}
            post={post}
            onClose={onClose}
            handleSubmit={handleSubmit}
          />
        ) : (
          <PublishedMenu
            scheduleOption={scheduleOption}
            setScheduleOption={setScheduleOption}
            setIsPublished={setIsPublished}
            onClose={onClose}
            handleSubmit={handleSubmit}
            isPublished={isPublished}
          />
        )}
      </MenuList>
    </Menu>
  );
};

const PublishedMenu = ({
  scheduleOption,
  setScheduleOption,
  handleSubmit,
  setIsPublished,
  onClose,
}) => {
  return (
    <>
      <RadioGroup
        m={"1rem 0rem 0 1rem"}
        defaultValue="now"
        value={scheduleOption}
      >
        <Stack direction={"column"}>
          <Radio
            colorScheme="blue"
            onClick={() => {
              setScheduleOption("unpublished");
            }}
            value="unpublished"
          >
            <Text
              fontWeight={"500"}
              color={"gray.600"}
              fontSize={"sm"}
              onClick={() => setScheduleOption("unpublished")}
            >
              Revert to draft
            </Text>
          </Radio>
          <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
            Revert this post to a private draft
          </Text>
          <Spacer />
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
              Published
            </Text>
          </Radio>
          <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
            Display this post publicly
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
            if (scheduleOption == "now") {
              setIsPublished(true);
            }

            if (scheduleOption == "unpublished") {
              setIsPublished(false);
              setScheduleOption("now");
            }

            handleSubmit(scheduleOption);
            onClose();
          }}
          mr="1rem"
          size="sm"
        >
          {scheduleOption === "unpublished" ? "Unpublish" : "Update"}
        </Button>
      </Flex>
    </>
  );
};

const NotPublishedMenu = ({
  scheduleOption,
  setScheduleOption,
  setIsPublished,
  setIsScheduled,
  isScheduled,
  isPublished,
  handleSubmit,
  onClose,
}) => {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const isScheduledAndDateValid =
    scheduledDate != "" && scheduledTime != "" && scheduleOption == "later";

  return (
    <>
      <RadioGroup
        m={"1rem 0rem 0 1rem"}
        defaultValue="now"
        value={scheduleOption}
      >
        <Stack direction={"column"}>
          <Radio
            colorScheme="blue"
            onClick={() => {
              if (isScheduled) {
                setScheduleOption("unpublished");
              } else {
                setScheduleOption("now");
              }
            }}
            value={isScheduled ? "unpublished" : "now"}
          >
            <Text
              fontWeight={"500"}
              color={"gray.600"}
              fontSize={"sm"}
              onClick={() => {
                if (isScheduled) {
                  setScheduleOption("unpublished");
                } else {
                  setScheduleOption("now");
                }
              }}
            >
              {isScheduled ? "Unschedule" : "Publish"}
            </Text>
          </Radio>
          <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
            {isScheduled ? "Revert to Draft" : "Post this post immediately"}
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
              {isScheduled ? "Reschedule" : "Schedule it for later"}
            </Text>
          </Radio>
          <DatePicker
            setScheduledDate={setScheduledDate}
            setScheduledTime={setScheduledTime}
          />
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
            if (scheduleOption == "now") {
              setIsPublished(true);
            }

            if (scheduleOption == "later") {
              setIsScheduled(true);
            }

            if (scheduleOption == "unpublished") {
              setIsPublished(false);
              setIsScheduled(false);
              setScheduleOption("now");
            }

            handleSubmit(scheduleOption, scheduledDate, scheduledTime);
            onClose();
          }}
          isDisabled={
            !isScheduledAndDateValid &&
            scheduleOption != "now" &&
            scheduleOption != "unpublished" &&
            !isPublished
          }
          mr="1rem"
          size="sm"
        >
          {isScheduled
            ? scheduleOption == "unpublished"
              ? "Unschedule"
              : "Reschedule"
            : scheduleOption == "now"
            ? "Publish"
            : "Schedule"}
        </Button>
      </Flex>
    </>
  );
};

const DatePicker = ({ setScheduledDate, setScheduledTime }) => {
  return (
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
          <Text fontSize={"sm"}>UTC</Text>
        </InputRightAddon>
      </InputGroup>
    </Stack>
  );
};

export default ScheduleMenu;
