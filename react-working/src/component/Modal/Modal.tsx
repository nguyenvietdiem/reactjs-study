import { Modal } from "antd";

const ModalForm = ({ title, onCancel, open, children }: any) => {
  return (
    <Modal
      title={title}
      footer={null}
      open={open}
      onCancel={onCancel}
    >
      {children}
    </Modal>
  );
};

export default ModalForm;
