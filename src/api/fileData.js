// 模拟文件数据
export const mockFiles = [
  { id: 1, name: '图片1.jpg', type: 'image', url: 'https://picx.zhimg.com/v2-d6f44389971daab7e688e5b37046e4e4_720w.jpg?source=172ae18b', ext: 'jpg', createdAt: '2024-06-01 10:00', size: 102400 },
  { id: 2, name: '视频1.mp4', type: 'video', url: 'https://earth-blogs.oss-cn-beijing.aliyuncs.com/oss/2023/11/14/29806890614-1-192.mp4', ext: 'mp4', createdAt: '2024-06-02 12:30', size: 2048000 },
  { id: 3, name: '文档.md', type: 'file', ext: 'md', createdAt: '2024-06-03 09:20', size: 4096, url: 'data:text/markdown;charset=utf-8,' + encodeURIComponent(`# Markdown 预览测试\n\n这是一个代码块：\n\n\`\`\`js\nfunction hello() {\n  console.log('Hello, world!');\n}\nhello();\n\`\`\`\n\n- 支持代码高亮\n- 支持标题、列表等 Markdown 语法\n`) },
  { id: 4, name: '表格.xlsx', type: 'file', ext: 'xlsx', createdAt: '2024-06-04 14:10', size: 8192, url: 'https://example.com/mock.xlsx' },
  { id: 5, name: 'PDF.pdf', type: 'file', ext: 'pdf', createdAt: '2024-06-05 16:45', size: 16384, url: 'https://example.com/mock.pdf' },
  {
    id: 6, name: '资料夹', type: 'folder', createdAt: '2024-06-06 08:00', size: 0, children: [
      { id: 7, name: '子图片.png', type: 'image', url: 'https://picx.zhimg.com/v2-d6f44389971daab7e688e5b37046e4e4_720w.jpg?source=172ae18b', ext: 'png', createdAt: '2024-06-06 08:10', size: 20480 },
      { id: 19, name: '子图片2.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', ext: 'jpg', createdAt: '2024-06-06 08:11', size: 20480 },
      { id: 20, name: '子图片3.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', ext: 'jpg', createdAt: '2024-06-06 08:12', size: 20480 },
      { id: 21, name: '子图片4.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', ext: 'jpg', createdAt: '2024-06-06 08:13', size: 20480 },
      { id: 22, name: '子图片5.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c', ext: 'jpg', createdAt: '2024-06-06 08:14', size: 20480 },
      { id: 23, name: '子图片2.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', ext: 'jpg', createdAt: '2024-06-06 08:11', size: 20480 },
      { id: 24, name: '子图片3.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429', ext: 'jpg', createdAt: '2024-06-06 08:12', size: 20480 },
      { id: 25, name: '子图片4.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', ext: 'jpg', createdAt: '2024-06-06 08:13', size: 20480 },
      { id: 26, name: '子图片5.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c', ext: 'jpg', createdAt: '2024-06-06 08:14', size: 20480 },
      { id: 8, name: '子文档.txt', type: 'file', ext: 'txt', createdAt: '2024-06-06 08:12', size: 1024, url: 'data:text/plain;charset=utf-8,' + encodeURIComponent('这是一个子文件夹里的txt文件\n支持多行内容\n123456') },
      { id: 9, name: '子文件夹A', type: 'folder', createdAt: '2024-06-06 08:15', size: 0, children: [
        { id: 10, name: 'A-图片2.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', ext: 'jpg', createdAt: '2024-06-06 08:16', size: 30480 },
        { id: 23, name: 'A-图片3.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', ext: 'jpg', createdAt: '2024-06-06 08:17', size: 30480 },
        { id: 24, name: 'A-图片4.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', ext: 'jpg', createdAt: '2024-06-06 08:18', size: 30480 },
        { id: 25, name: 'A-图片2.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', ext: 'jpg', createdAt: '2024-06-06 08:16', size: 30480 },
        { id: 26, name: 'A-图片3.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99', ext: 'jpg', createdAt: '2024-06-06 08:17', size: 30480 },
        { id: 27, name: 'A-图片4.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', ext: 'jpg', createdAt: '2024-06-06 08:18', size: 30480 },
        { id: 28, name: 'A-子文件夹B', type: 'folder', createdAt: '2024-06-06 08:18', size: 0, children: [
          { id: 12, name: 'B-音频.mp3', type: 'file', ext: 'mp3', createdAt: '2024-06-06 08:19', size: 204800, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { id: 13, name: 'B-子文件夹C', type: 'folder', createdAt: '2024-06-06 08:20', size: 0, children: [
            { id: 14, name: 'C-表格.xlsx', type: 'file', ext: 'xlsx', createdAt: '2024-06-06 08:21', size: 8192, url: 'https://example.com/mock-c.xlsx' },
            { id: 15, name: 'C-文档.md', type: 'file', ext: 'md', createdAt: '2024-06-06 08:22', size: 4096, url: 'data:text/markdown;charset=utf-8,' + encodeURIComponent('# 嵌套Markdown\n\n- 这是C文件夹下的md文件\n- 多层嵌套测试') }
          ]}
        ]}
      ]},
      { id: 16, name: '子文件夹D', type: 'folder', createdAt: '2024-06-06 08:25', size: 0, children: [
        { id: 17, name: 'D-PDF.pdf', type: 'file', ext: 'pdf', createdAt: '2024-06-06 08:26', size: 16384, url: 'https://example.com/d-pdf.pdf' },
        { id: 18, name: 'D-视频.mp4', type: 'video', url: 'https://earth-blogs.oss-cn-beijing.aliyuncs.com/oss/2023/11/14/29806890614-1-192.mp4', ext: 'mp4', createdAt: '2024-06-06 08:27', size: 2048000 }
      ]}
    ]
  }
]

// 模拟API：获取文件列表
export function fetchFiles() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockFiles])
    }, 200)
  })
}

// 递归拍平所有文件（含子文件夹）
export function flattenFiles(files) {
  let result = []
  for (const file of files) {
    if (file.type === 'folder' && Array.isArray(file.children)) {
      result.push(file)
      result = result.concat(flattenFiles(file.children))
    } else {
      result.push(file)
    }
  }
  return result
}

// 模拟API：迁移文件
export function moveFile({ fileId, targetFolderId }) {
  // 递归查找并删除文件
  function removeFile(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        const file = list[i]
        list.splice(i, 1)
        return file
      }
      if (list[i].type === 'folder' && Array.isArray(list[i].children)) {
        const file = removeFile(list[i].children, id)
        if (file) return file
      }
    }
    return null
  }
  // 递归查找目标文件夹
  function findFolder(list, id) {
    for (const item of list) {
      if (item.id === id && item.type === 'folder') return item
      if (item.type === 'folder' && Array.isArray(item.children)) {
        const found = findFolder(item.children, id)
        if (found) return found
      }
    }
    return null
  }
  const file = removeFile(mockFiles, fileId)
  const folder = findFolder(mockFiles, targetFolderId)
  if (file && folder) {
    if (!Array.isArray(folder.children)) folder.children = []
    folder.children.push(file)
    return Promise.resolve({ code: 0, msg: '迁移成功', data: true })
  } else {
    return Promise.resolve({ code: 1, msg: '迁移失败', data: false })
  }
} 