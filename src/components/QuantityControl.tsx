import React from "react";
import { Button, InputNumber } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface QuantityControlProps {
  quantity: number;
  max: number;
  min?: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (value: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  max,
  min = 1,
  onDecrease,
  onIncrease,
  onChange,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        icon={<MinusOutlined />}
        disabled={quantity <= min}
        onClick={onDecrease}
      />
      <InputNumber
        min={min}
        max={max}
        value={quantity}
        onChange={(value) => onChange(value || min)}
        style={{ width: 72 }}
      />
      <Button
        icon={<PlusOutlined />}
        disabled={quantity >= max}
        onClick={onIncrease}
      />
    </div>
  );
};

export default QuantityControl;
