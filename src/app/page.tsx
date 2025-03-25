"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function Page() {
  const [base64Input, setBase64Input] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepPrefix, setKeepPrefix] = useState(false);
  const [dataUrl, setDataUrl] = useState("");
  const [jsonKey, setJsonKey] = useState("image"); // 默认key为"image"
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // 当keepPrefix或jsonKey变化时，尝试重新生成JSON
  useEffect(() => {
    if (base64Input.trim()) {
      convertToJson();
    }
  }, [keepPrefix, jsonKey]);

  // 检测文本是否溢出
  useEffect(() => {
    const checkOverflow = () => {
      if (preRef.current) {
        const isOverflowing = preRef.current.scrollHeight > preRef.current.clientHeight;
        if (isOverflowing) {
          preRef.current.classList.add('overflow');
        } else {
          preRef.current.classList.remove('overflow');
        }
      }
    };
    
    checkOverflow();
    // 监听窗口大小变化，重新检测
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [jsonOutput]);

  const convertToJson = useCallback(() => {
    if (!base64Input.trim()) {
      setError("请先上传图片或输入Base64内容");
      return;
    }

    if (!jsonKey.trim()) {
      setError("JSON键名不能为空");
      return;
    }
    
    setError("");
    try {
      console.log("生成JSON，keepPrefix:", keepPrefix, "dataUrl存在:", !!dataUrl);
      // 在用户手动点击转换按钮时，如果有完整的dataUrl并且用户选择保留前缀
      // 则使用完整的dataUrl，否则使用当前的base64Input
      let imageData = base64Input;
      
      if (keepPrefix && dataUrl && base64Input && !base64Input.startsWith('data:')) {
        console.log("使用dataUrl作为数据源");
        imageData = dataUrl;
      } else if (!keepPrefix && base64Input.startsWith('data:')) {
        console.log("移除前缀");
        imageData = base64Input.split(',')[1] || '';
      }
      
      // 使用用户定义的key
      const jsonObject: Record<string, string> = {};
      jsonObject[jsonKey] = imageData;
      
      const jsonResult = JSON.stringify(jsonObject, null, 2);
      setJsonOutput(jsonResult);
    } catch (err) {
      setJsonOutput("转换出错，请检查输入");
      console.error("JSON转换错误:", err);
    }
  }, [base64Input, jsonKey, keepPrefix, dataUrl]);

  // 复制功能确保能获取完整内容
  const copyToClipboard = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("复制失败:", err));
  };

  // 当"保留前缀"选项变化时更新base64Input
  const handleKeepPrefixChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("切换前缀选项", e.target.checked);
    const newKeepPrefix = e.target.checked;
    setKeepPrefix(newKeepPrefix);
    
    // 如果有dataUrl数据，根据选项更新输入
    if (dataUrl) {
      if (newKeepPrefix) {
        setBase64Input(dataUrl);
      } else {
        const base64String = dataUrl.split(',')[1];
        setBase64Input(base64String || "");
      }
    }
  }, [dataUrl]);

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError("请上传有效的图片文件");
      return;
    }

    setError("");
    setFileName(file.name);
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        if (!result) {
          throw new Error("读取图片失败");
        }
        
        // 存储完整的dataUrl，以便后续使用
        setDataUrl(result);
        console.log("设置dataUrl:", result.substring(0, 50) + "...");
        
        // 提取base64部分 (去掉前缀)
        const base64String = result.split(',')[1];
        
        // 根据keepPrefix选项决定是否保留前缀
        const finalBase64 = keepPrefix ? result : (base64String || "");
        console.log("设置base64Input:", finalBase64.substring(0, 20) + "...", "keepPrefix:", keepPrefix);
        setBase64Input(finalBase64);

        // 在设置base64Input之后直接调用convertToJson
        setTimeout(() => {
          try {
            // 生成JSON对象
            const jsonObject: Record<string, string> = {};
            jsonObject[jsonKey] = finalBase64;
            
            const jsonResult = JSON.stringify(jsonObject, null, 2);
            setJsonOutput(jsonResult);
          } catch (err) {
            console.error("生成JSON出错:", err);
          }
        }, 0);
        
      } catch (err) {
        setError("处理图片时出错");
        console.error("处理图片错误:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError("读取文件失败");
      setIsLoading(false);
      console.error("FileReader错误");
    };
    
    // 开始读取文件
    reader.readAsDataURL(file);
  }, [keepPrefix, jsonKey]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("上传文件")
    const file = e.target.files?.[0];
    if (file) {
      // 重置文件输入，确保同一文件可以再次选择
      e.target.value = "";
      processFile(file);
    }
  }, [processFile]);

  const triggerFileInput = useCallback(() => {
    if (isLoading) return;
    fileInputRef.current?.click();
  }, [isLoading]);

  return (
    <div className="min-h-screen vintage-bg">
      <div className="container">
        <header className="mb-10 flex flex-col items-center">
          <h1 className="title text-4xl mb-2">BASE64 转换工具</h1>
          <div className="title-underline"></div>
          <p className="text-vintage text-center">上传图片、转换Base64、生成JSON</p>
        </header>
        
        <div className="grid md:grid-cols-12 gap-8 mb-8">
          <div className="card md:col-span-5">
            <h2 className="title text-xl mb-4 pb-2 inline-block">输入</h2>
            
            <div 
              ref={dropZoneRef}
              onClick={triggerFileInput}
              className={`drop-zone mb-4 ${error ? 'error' : ''} ${isLoading ? 'pointer-events-none' : ''}`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              {isLoading ? (
                <div className="flex-center py-4">
                  <div className="spinner"></div>
                  <span className="ml-3 text-vintage font-medium">处理中...</span>
                </div>
              ) : (
                <>
                  <div className="rounded-full bg-[var(--color-text-secondary)] p-2 mb-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-vintage font-medium mb-1 text-xs">点击上传图片</p>
                  {fileName && (
                    <div className="text-xs text-vintage truncate max-w-[120px]" title={fileName}>
                      {fileName}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {error && <p className="text-[var(--color-error)] text-sm mb-4 bg-[var(--color-input-bg)] p-2 rounded">{error}</p>}
            
            <div className="space-y-4 mb-4">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="toggle-container">
                    <input 
                      type="checkbox" 
                      id="keepPrefix" 
                      className="toggle"
                      checked={keepPrefix}
                      onChange={handleKeepPrefixChange}
                    />
                    <span className="toggle-slider"></span>
                  </div>
                  <span className="text-sm text-vintage ml-2">
                    保留data:image/jpeg;base64前缀
                  </span>
                </label>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="jsonKey" className="input-label">
                  JSON 键名:
                </label>
                <input
                  type="text"
                  id="jsonKey"
                  value={jsonKey}
                  onChange={(e) => setJsonKey(e.target.value)}
                  className="input-field"
                  placeholder="输入JSON键名"
                />
              </div>
            </div>
            
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-[var(--color-border)]"></div>
              <span className="px-3 text-sm text-[var(--color-accent-secondary)]">或直接粘贴</span>
              <div className="flex-grow h-px bg-[var(--color-border)]"></div>
            </div>
            
            <textarea
              className="input-field w-full h-56 font-mono"
              value={base64Input}
              onChange={(e) => {
                setBase64Input(e.target.value);
                setError("");
              }}
              placeholder="在此粘贴base64内容..."
            />
            
            <button
              className={`btn w-full mt-4 ${isLoading ? 'bg-[var(--color-border)] cursor-not-allowed' : 'btn-primary'}`}
              onClick={convertToJson}
              disabled={isLoading}
            >
              转换为 JSON
            </button>
          </div>
          
          <div className="card md:col-span-7">
            <div className="flex-between mb-4">
              <h2 className="title text-xl pb-2 inline-block">JSON 结果</h2>
              <div className="flex items-center">
                <span className="text-xs text-vintage mr-2">可复制完整内容</span>
                <button
                  className={`btn btn-round ${copied ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={copyToClipboard}
                >
                  {copied ? "已复制!" : "复制结果"}
                </button>
              </div>
            </div>
            
            <div className="w-full" style={{ minHeight: '450px', position: 'relative' }}>
              <pre ref={preRef} className="code-block">
                {jsonOutput || '等待生成JSON...'}
              </pre>
            </div>
          </div>
        </div>
        
        <footer className="text-center text-[var(--color-accent-secondary)] text-sm mt-12">
          <div className="w-16 h-1 bg-[var(--color-accent-primary)] mx-auto mb-4"></div>
          <p>Base64 JSON 在线转换工具 • 简单高效</p>
        </footer>
      </div>
    </div>
  );
}