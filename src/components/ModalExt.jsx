import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from "@chakra-ui/react";

const ModalExt = ({ openModal, message, closeModal }) => {

  let bodyModal;

  if (message && /(Sorry, you lost)|(Nobody wins)/gi.test(message)) {
    bodyModal = "More luck the following time"
  }
  if (message && message.includes("win")) {
    bodyModal = "Congratulations! Try the multiplayer local mode by adding new players"
  }

  return (
    <Modal isOpen={openModal} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{message}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {bodyModal}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalExt;
