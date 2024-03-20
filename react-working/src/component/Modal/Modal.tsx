import { Button, Modal } from "antd";

const ModalForm = ({ title, onCancel, open, children }: any) => {
  return (
    <Modal
      title={title}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
      open={open}
      onCancel={onCancel}
    >
      {children}
    </Modal>
  );
};

export default ModalForm;
