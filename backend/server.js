const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 配置CORS
app.use(cors());
app.use(express.json());

// JSON数据文件路径
const DATA_FILE = path.join(__dirname, 'wishes.json');

// 确保数据文件存在
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  console.log('创建了心愿数据文件');
}

// 读取心愿数据
function readWishes() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('读取心愿数据失败:', err);
    return [];
  }
}

// 保存心愿数据
function saveWishes(wishes) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(wishes, null, 2));
    return true;
  } catch (err) {
    console.error('保存心愿数据失败:', err);
    return false;
  }
}

// API路由

// 获取所有心愿
app.get('/api/wishes', (req, res) => {
  try {
    const wishes = readWishes();
    // 按创建时间倒序排列
    wishes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(wishes);
  } catch (err) {
    console.error('查询心愿失败:', err);
    res.status(500).json({ error: '查询心愿失败' });
  }
});

// 创建心愿
app.post('/api/wishes', (req, res) => {
  const { author, content } = req.body;
  
  if (!author || !content) {
    return res.status(400).json({ error: '昵称和心愿内容不能为空' });
  }
  
  try {
    const wishes = readWishes();
    
    const newWish = {
      id: wishes.length > 0 ? Math.max(...wishes.map(w => w.id)) + 1 : 1,
      author: author.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    wishes.unshift(newWish);
    
    if (saveWishes(wishes)) {
      res.status(201).json(newWish);
    } else {
      res.status(500).json({ error: '保存心愿失败' });
    }
  } catch (err) {
    console.error('创建心愿失败:', err);
    res.status(500).json({ error: '创建心愿失败' });
  }
});

// 删除心愿
app.delete('/api/wishes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const wishes = readWishes();
    const initialLength = wishes.length;
    
    const filteredWishes = wishes.filter(wish => wish.id !== id);
    
    if (filteredWishes.length === initialLength) {
      return res.status(404).json({ error: '心愿不存在' });
    }
    
    if (saveWishes(filteredWishes)) {
      res.json({ message: '心愿删除成功' });
    } else {
      res.status(500).json({ error: '删除心愿失败' });
    }
  } catch (err) {
    console.error('删除心愿失败:', err);
    res.status(500).json({ error: '删除心愿失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
