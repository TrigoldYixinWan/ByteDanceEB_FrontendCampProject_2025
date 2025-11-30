'use client';

import { Form, Select, TagInput } from 'tdesign-react';

const { FormItem } = Form;

// 定义类型接口
interface FormData {
  businessId: string;
  sceneId: string;
  tags: string[];
}

interface BusinessOption {
  value: string;
  label: string;
}

interface SceneOption {
  value: string;
  label: string;
}

interface DocumentFormProps {
  formData?: FormData;
  businessOptions?: BusinessOption[];
  sceneOptions?: SceneOption[];
  onChange: (field: keyof FormData, value: string | string[]) => void;
}

export default function DocumentForm({
  formData = { businessId: '', sceneId: '', tags: [] },
  businessOptions = [],
  sceneOptions = [],
  onChange,
}: DocumentFormProps) {
  return (
    <Form layout="vertical">
      <FormItem label="所属业务" rules={[{ required: true, message: '请选择所属业务' }]}>
        <Select
          value={formData.businessId}
          placeholder="请选择所属业务"
          onChange={(value) => onChange('businessId', String(value))}
          clearable
        >
          {businessOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>

      <FormItem label="所属场景" rules={[{ required: true, message: '请选择所属场景' }]}>
        <Select
          value={formData.sceneId}
          placeholder="请选择所属场景"
          onChange={(value) => onChange('sceneId', String(value))}
          disabled={!formData.businessId || sceneOptions.length === 0}
          clearable
        >
          {sceneOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>

      <FormItem label="标签">
        <TagInput
          value={formData.tags}
          placeholder="输入标签后按回车添加"
          onChange={(tags) =>
            onChange(
              'tags',
              tags.map((tag) => String(tag)),
            )
          }
          clearable
        />
      </FormItem>
    </Form>
  );
}
