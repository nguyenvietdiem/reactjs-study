import { Button } from "antd";

const ButtonForm = ({ id, onCancel }: any) => {
  return (
    <div>
      <Button htmlType="submit" form={id} type="primary">
        Send
      </Button>
      <Button key="back" onClick={onCancel}>
        Close
      </Button>
    </div>
  );
};

export default ButtonForm;
