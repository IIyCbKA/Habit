import React from "react";
import styles from "./styles.module.css";
import { UsernameModalProps } from "./interface";
import { Button, Input, Modal, Typography } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUsername, usernameUpdate } from "@/features/Auth/slice";
import {
  CONTINUE_BUTTON_TEXT,
  MODAL_TITLE,
  NEW_USERNAME_PLACEHOLDER,
} from "./constants";
import { EMPTY_STRING } from "@/shared/constants";

export default function UsernameModal({
  isOpen,
  onClose,
}: UsernameModalProps): React.ReactElement {
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [newUsername, setNewUsername] = React.useState<string>(EMPTY_STRING);
  const [isProcessing, setProcessing] = React.useState<boolean>(false);

  const onNewUsernameChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewUsername(e.target.value);
  };

  const cleanNewUsername: () => void = (): void => {
    setNewUsername(EMPTY_STRING);
  };

  const onSubmit: (e: React.FormEvent) => void = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();

    setProcessing(true);
    try {
      await dispatch(usernameUpdate({ username: newUsername })).unwrap();
      onClose();
    } catch (e) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onExited={cleanNewUsername}
      withCloseButton
    >
      <form className={styles.modalContent} onSubmit={onSubmit} noValidate>
        <Typography className={styles.titleModal}>{MODAL_TITLE}</Typography>
        <Input fullWidth disabled onlyDisabled value={username} />
        <Input
          fullWidth
          value={newUsername}
          onChange={onNewUsernameChange}
          placeholder={NEW_USERNAME_PLACEHOLDER}
        />
        <Button
          fullWidth
          type={"submit"}
          variant={"contained"}
          isLoading={isProcessing}
        >
          {CONTINUE_BUTTON_TEXT}
        </Button>
      </form>
    </Modal>
  );
}
