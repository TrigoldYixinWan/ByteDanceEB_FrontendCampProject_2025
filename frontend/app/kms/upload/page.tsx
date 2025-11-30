'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Select,
  TagInput,
  Input,
  Upload,
  Button,
  MessagePlugin,
  Textarea,
} from 'tdesign-react';
import { UploadIcon } from 'tdesign-icons-react';
import type { UploadFile } from 'tdesign-react';

const { FormItem } = Form;

// 定义类型接口
interface BusinessOption {
  value: string;
  label: string;
}

interface SceneOption {
  value: string;
  label: string;
  businessId: string;
}

interface CommonFormData {
  businessId: string;
  sceneId: string;
  tags: string[];
}

interface PdfFormData {
  file: UploadFile | null;
  title: string;
  description: string;
}

interface ManualFormData {
  title: string;
  content: string;
  description: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('pdf');
  const [commonFormData, setCommonFormData] = useState<CommonFormData>({
    businessId: '',
    sceneId: '',
    tags: [],
  });
  const [pdfData, setPdfData] = useState<PdfFormData>({
    file: null,
    title: '',
    description: '',
  });
  const [manualData, setManualData] = useState<ManualFormData>({
    title: '',
    content: '',
    description: '',
  });

  // 业务和场景数据（实际应用中从API获取）
  const [businessOptions] = useState<BusinessOption[]>([
    { value: '1', label: '零售业务' },
    { value: '2', label: '餐饮业务' },
    { value: '3', label: '服务业务' },
  ]);

  const [sceneOptions] = useState<SceneOption[]>([
    { value: '1', label: '销售场景', businessId: '1' },
    { value: '2', label: '客服场景', businessId: '1' },
    { value: '3', label: '营销场景', businessId: '2' },
    { value: '4', label: '运营场景', businessId: '2' },
    { value: '5', label: '培训场景', businessId: '3' },
  ]);

  // 根据选择的业务过滤场景
  const [filteredSceneOptions, setFilteredSceneOptions] = useState<SceneOption[]>([]);

  useEffect(() => {
    // 当业务选择变化时，过滤场景选项
    if (commonFormData.businessId) {
      const filtered = sceneOptions.filter(
        (scene) => scene.businessId === commonFormData.businessId,
      );
      setFilteredSceneOptions(filtered);

      // 如果当前选择场景不在过滤后的列表中，清空场景选择
      if (
        commonFormData.sceneId &&
        !filtered.some((scene) => scene.value === commonFormData.sceneId)
      ) {
        setCommonFormData((prev) => ({ ...prev, sceneId: '' }));
      }
    } else {
      setFilteredSceneOptions([]);
    }
  }, [commonFormData.businessId, sceneOptions, commonFormData.sceneId]);

  const handleCommonFormChange = (field: keyof CommonFormData, value: string | string[]) => {
    setCommonFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePdfDataChange = (field: keyof PdfFormData, value: string | UploadFile | null) => {
    setPdfData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManualDataChange = (field: keyof ManualFormData, value: string) => {
    setManualData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // 验证通用表单
    if (!commonFormData.businessId) {
      MessagePlugin.error('请选择所属业务');
      return false;
    }

    if (!commonFormData.sceneId) {
      MessagePlugin.error('请选择所属场景');
      return false;
    }

    if (activeTab === 'pdf') {
      // 验证PDF上传表单
      if (!pdfData.file) {
        MessagePlugin.error('请选择要上传的PDF文件');
        return false;
      }

      if (!pdfData.title) {
        MessagePlugin.error('请输入文档标题');
        return false;
      }
    } else {
      // 验证手动创建表单
      if (!manualData.title) {
        MessagePlugin.error('请输入文档标题');
        return false;
      }

      if (!manualData.content) {
        MessagePlugin.error('请输入文档内容');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // 创建FormData对象用于文件上传
      const formData = new FormData();
      formData.append('businessId', commonFormData.businessId);
      formData.append('sceneId', commonFormData.sceneId);
      formData.append('tags', JSON.stringify(commonFormData.tags));

      if (activeTab === 'pdf') {
        formData.append('type', 'pdf');
        formData.append('title', pdfData.title);
        formData.append('description', pdfData.description || '');
        if (pdfData.file) {
          // 从 UploadFile 对象中获取原始文件对象
          // 如果是原生文件对象，直接使用
          interface FileObject {
            name: string;
            size: number;
            type: string;
            response?: File;
          }
          const fileObj = pdfData.file as unknown as FileObject;
          if (fileObj instanceof File) {
            formData.append('file', fileObj);
          } else if (fileObj.response && fileObj.response instanceof File) {
            formData.append('file', fileObj.response);
          }
        }
      } else {
        formData.append('type', 'manual');
        formData.append('title', manualData.title);
        formData.append('description', manualData.description || '');
        formData.append('content', manualData.content);
      }

      // 调用API提交数据
      const response = await fetch('/api/kms/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      await response.json();

      MessagePlugin.success('文档上传成功');

      // 重置表单
      setCommonFormData({
        businessId: '',
        sceneId: '',
        tags: [],
      });
      setPdfData({
        file: null,
        title: '',
        description: '',
      });
      setManualData({
        title: '',
        content: '',
        description: '',
      });

      // 跳转到文档列表页
      router.push('/kms/documents');
    } catch (error) {
      console.error('上传文档失败:', error);
      MessagePlugin.error('上传文档失败，请稍后重试');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // 文件上传前验证
  const beforeUpload = (file: UploadFile) => {
    // TDesign的Upload组件传递的是UploadFile对象，需要获取其原始文件
    const rawFile = file.response || file;

    // 检查文件类型
    if (rawFile.type !== 'application/pdf') {
      MessagePlugin.error('只能上传PDF格式的文件');
      return false;
    }

    // 检查文件大小（10MB）
    if (rawFile.size > 10 * 1024 * 1024) {
      MessagePlugin.error('文件大小不能超过10MB');
      return false;
    }

    return true;
  };

  // 处理文件变化
  const handleUploadChange = (files: UploadFile[]) => {
    if (files.length > 0) {
      const file = files[0];
      // 如果文件名不为空且标题为空，则使用文件名作为标题
      if (file.name && !pdfData.title) {
        // 移除文件扩展名
        const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
        handlePdfDataChange('title', nameWithoutExt);
      }
      handlePdfDataChange('file', file);
    } else {
      handlePdfDataChange('file', null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>上传文档</h2>

      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* 标签页切换 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: activeTab === 'pdf' ? '3px solid #1890ff' : 'none',
              color: activeTab === 'pdf' ? '#1890ff' : '#666',
              fontWeight: activeTab === 'pdf' ? '500' : 'normal',
            }}
            onClick={() => setActiveTab('pdf')}
          >
            上传PDF文档
          </div>
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: activeTab === 'manual' ? '3px solid #1890ff' : 'none',
              color: activeTab === 'manual' ? '#1890ff' : '#666',
              fontWeight: activeTab === 'manual' ? '500' : 'normal',
            }}
            onClick={() => setActiveTab('manual')}
          >
            手动创建文档
          </div>
        </div>

        {/* 通用表单 */}
        <div style={{ marginTop: '20px' }}>
          <Form layout="vertical">
            <FormItem label="所属业务" rules={[{ required: true, message: '请选择所属业务' }]}>
              <Select
                value={commonFormData.businessId}
                placeholder="请选择所属业务"
                onChange={(value) => handleCommonFormChange('businessId', String(value))}
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
                value={commonFormData.sceneId}
                placeholder="请选择所属场景"
                onChange={(value) => handleCommonFormChange('sceneId', String(value))}
                disabled={!commonFormData.businessId || filteredSceneOptions.length === 0}
                clearable
              >
                {filteredSceneOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>

            <FormItem label="标签">
              <TagInput
                value={commonFormData.tags}
                placeholder="输入标签后按回车添加"
                onChange={(tags) =>
                  handleCommonFormChange(
                    'tags',
                    tags.map((tag) => String(tag)),
                  )
                }
                clearable
              />
            </FormItem>
          </Form>
        </div>

        {activeTab === 'pdf' && (
          <div style={{ marginTop: '20px' }}>
            <Form layout="vertical">
              <FormItem label="上传PDF文件" rules={[{ required: true, message: '请选择PDF文件' }]}>
                <Upload
                  action="" // 空字符串表示不上传到服务器，而是自己处理
                  theme="file-flow"
                  placeholder="点击或拖拽PDF文件到此区域上传"
                  accept="application/pdf"
                  autoUpload={false}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  multiple={false}
                  max={1}
                >
                  <Button theme="default" variant="dashed" icon={<UploadIcon />}>
                    点击上传
                  </Button>
                </Upload>
              </FormItem>

              <FormItem label="文档标题" rules={[{ required: true, message: '请输入文档标题' }]}>
                <Input
                  value={pdfData.title}
                  placeholder="请输入文档标题"
                  onChange={(value) => handlePdfDataChange('title', value)}
                  clearable
                />
              </FormItem>

              <FormItem label="文档描述">
                <Input
                  value={pdfData.description}
                  placeholder="请输入文档描述"
                  onChange={(value) => handlePdfDataChange('description', value)}
                  clearable
                />
              </FormItem>
            </Form>
          </div>
        )}

        {activeTab === 'manual' && (
          <div style={{ marginTop: '20px' }}>
            <Form layout="vertical">
              <FormItem label="文档标题" rules={[{ required: true, message: '请输入文档标题' }]}>
                <Input
                  value={manualData.title}
                  placeholder="请输入文档标题"
                  onChange={(value) => handleManualDataChange('title', value)}
                  clearable
                />
              </FormItem>

              <FormItem label="文档内容" rules={[{ required: true, message: '请输入文档内容' }]}>
                <Textarea
                  value={manualData.content}
                  placeholder="请输入文档内容"
                  onChange={(value) => handleManualDataChange('content', value)}
                  autosize={{ minRows: 8, maxRows: 15 }}
                />
              </FormItem>

              <FormItem label="文档描述">
                <Input
                  value={manualData.description}
                  placeholder="请输入文档描述"
                  onChange={(value) => handleManualDataChange('description', value)}
                  clearable
                />
              </FormItem>
            </Form>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <Button theme="default" onClick={handleCancel} style={{ marginRight: '10px' }}>
            取消
          </Button>
          <Button theme="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </div>
    </div>
  );
}
