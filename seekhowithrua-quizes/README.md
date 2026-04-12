# SeekhoWithRua Quizzes

Quiz system for testing knowledge across all courses.

## 🚀 Quick Start

To add a new quiz:

1. **Copy the template:**
   ```bash
   cp _TEMPLATE.html your-quiz-name.html
   ```

2. **Edit the `quizConfig` object** at the top of the file:
   ```javascript
   const quizConfig = {
     id: 'unique-quiz-id',           // Unique identifier (no spaces)
     title: 'Your Quiz Title',       // Display title
     category: 'python',             // python, data-science, web-dev, ai-ml, cloud, devops
     icon: '🐍',                     // Emoji icon
     difficulty: 'easy',             // easy, medium, hard
     passingScore: 70,               // Percentage to pass
     
     questions: [
       {
         question: "Your question here?",
         options: ["Option A", "Option B", "Option C", "Option D"],
         correct: 1,  // Index of correct answer (0-based)
         explanation: "Why this is the correct answer"
       }
       // Add more questions...
     ]
   };
   ```

3. **Add to quiz listing** in `index.html`:
   Open `index.html` and add your quiz to the `quizzes` array:
   ```javascript
   {
     id: 'unique-quiz-id',
     title: 'Your Quiz Title',
     category: 'python',
     icon: '🐍',
     iconBg: 'linear-gradient(135deg, #3776ab, #ffd43b)',
     difficulty: 'easy',
     questions: 20,
     duration: '15 min',
     description: 'Brief description of your quiz.',
     file: 'your-quiz-name.html'
   }
   ```

4. **Done!** Your quiz will automatically appear in the dashboard.

## 📁 File Structure

```
seekhowithrua-quizes/
├── index.html           # Quiz dashboard with all quizzes
├── _TEMPLATE.html       # Copy this to create new quizzes
├── README.md           # This file
├── js/
│   └── auth.js         # Authentication handler
├── python-basics.html  # Sample quiz
└── [your-quizzes].html # Your quiz files
```

## 🎨 Categories & Colors

| Category | Color Code | Example Icon BG |
|----------|------------|-----------------|
| python | Yellow/Blue | `linear-gradient(135deg, #3776ab, #ffd43b)` |
| data-science | Purple/Cyan | `linear-gradient(135deg, #7c3aed, #00d4ff)` |
| web-dev | Red/Orange | `linear-gradient(135deg, #e74c3c, #f39c12)` |
| ai-ml | Pink/Purple | `linear-gradient(135deg, #ff6b6b, #7c3aed)` |
| cloud | Orange/Dark | `linear-gradient(135deg, #ff9900, #232f3e)` |
| devops | Orange/Brown | `linear-gradient(135deg, #e67e22, #d35400)` |

## 🔐 Authentication

All quizzes require login via COSMOS_AUTH. The flow:
1. User clicks quiz → checks if logged in
2. If not logged in → shows login modal with redirect
3. After login → returns to quiz with token
4. Quiz progress saved to localStorage

## 📊 Features

- ✅ Multiple choice questions
- ✅ Progress bar showing completion
- ✅ Score tracking & persistence
- ✅ Review answers with explanations
- ✅ Pass/fail based on configurable threshold
- ✅ Category filtering on dashboard
- ✅ Responsive design
- ✅ Beautiful animations

## 📝 Question Format

Each question object:
```javascript
{
  question: "Question text?",
  options: ["A", "B", "C", "D"],  // 2-6 options supported
  correct: 0,  // Index (0-based) of correct answer
  explanation: "Explanation shown after quiz submission"
}
```

## 🎯 Scoring

- Each correct answer: +1 point
- Final score: `(correct / total) * 100`
- Passing determined by `passingScore` config
- Results stored in localStorage under `quizes_progress`

## 🔄 Retaking Quizzes

Once completed, quiz shows results with:
- Score percentage
- Pass/fail status
- Review all answers
- Option to retake (clears previous result)

## 🛠️ Customization

### Change passing score:
```javascript
passingScore: 80  // Now requires 80% to pass
```

### Add more questions:
Simply add more question objects to the `questions` array.

### Change difficulty:
```javascript
difficulty: 'hard'  // Changes badge color
```

## 📱 Mobile Support

All quizzes are responsive and work on mobile devices.

## 🔗 Integration

The quiz system is linked from:
- LMS Header (📝 Quizzes)
- LMS Homepage (Tools & Builders section)
- Individual course pages (recommended)

---

**Need help?** Check the existing `python-basics.html` for a complete example!
