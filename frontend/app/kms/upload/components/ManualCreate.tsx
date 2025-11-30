'use client';

import { Form, Input, Textarea } from 'tdesign-react';

const { FormItem } = Form;

// 定义类型接口
interface ManualFormData {
  title: string;
  content: string;
  description: string;
}

interface ManualCreateProps {
  data?: ManualFormData;
  onChange: (field: keyof ManualFormData, value: string) => void;
}

export default function ManualCreate({
  data = { title: '', content: '', description: '' },
  onChange,
}: ManualCreateProps) {
  return (
    <div style={{ marginTop: '20px' }}>
      <Form layout="vertical">
        <FormItem label="文档标题" rules={[{ required: true, message: '请输入文档标题' }]}>
          <Input
            value={data.title}
            placeholder="请输入文档标题"
            onChange={(value) => onChange('title', value)}
            clearable
          />
        </FormItem>

        <FormItem label="文档内容" rules={[{ required: true, message: '请输入文档内容' }]}>
          <Textarea
            value={data.content}
            placeholder="请输入文档内容"
            onChange={(value) => onChange('content', value)}
            autosize={{ minRows: 8, maxRows: 15 }}
          />
        </FormItem>

        <FormItem label="文档描述">
          <Input
            value={data.description}
            placeholder="请输入文档描述"
            onChange={(value) => onChange('description', value)}
            clearable
          />
        </FormItem>
      </Form>
    </div>
  );
}
