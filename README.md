# Timeline React Component

A modern and interactive timeline visualization implementation built with React.

## 🚀 How to Run

```bash
npm install
npm start
```

The application will run at `http://localhost:1234` (or similar port).

## 📋 Implemented Features

### ✅ Core Features

- **Lane Visualization**: Automatic organization of items in compact horizontal lanes
- **Efficient Layout**: Non-overlapping items share the same lane
- **Smart Relaxation**: Very short items or items with long names receive extra space

### ✅ Advanced Features

- **Complete Drag & Drop**:
  - Drag to move items
  - Resize by edges to change dates
  - Real-time preview during drag
- **Inline Editing**: Double-click to edit item names
- **Zoom System**:
  - Zoom controls (buttons, slider, presets)
  - Keyboard shortcuts (Ctrl + +/-, Ctrl + 0)
  - Minimizable panel
- **Auto Expansion**: Timeline expands when items are dragged outside bounds
- **Visual Indicators**:
  - Visual feedback during operations
  - Expansion needed indicators
  - Hover and focus states

## 🎨 What I Like About the Implementation

### **1. Component Architecture**

- Clear separation of responsibilities between components
- Context API for global state management (zoom, data)
- Custom hooks for reusable logic

### **2. Rich User Experience**

- **Immediate Visual Feedback**: Every interaction has clear visual response
- **Drag Preview**: User sees changes before confirming
- **Multiple Interaction Forms**: Mouse, keyboard, visual controls
- **Responsive Design**: Works well on different screen sizes

### **3. Optimized Performance**

- `useCallback` and `useMemo` to prevent unnecessary re-renders
- Efficient event listeners with proper cleanup
- CSS transforms for smooth animations

### **4. Robustness**

- Data validation and edge case handling
- Detailed logs for debugging
- Fallbacks for error states

### **5. Smart Zoom System**

- Scale compensation to maintain font readability
- Synchronization between header and content
- Intuitive and accessible controls

## 🔄 What I Would Change If I Were to Do It Again

### **1. State Structure**

- **Use Redux Toolkit** for more complex state management
- **Implement immutable state** with Immer for better debugging
- **Better separation** of UI vs. business data state

### **2. Typing**

- **Migrate to TypeScript** for better developer experience
- **Define clear interfaces** for all data
- **Props validation** with PropTypes or Zod

### **3. Testing**

- **Start with TDD** (Test-Driven Development)
- **Use React Testing Library** from the beginning
- **Implement integration tests** for complete flows

### **4. Performance**

- **Virtualization** for large datasets (react-window)
- **Web Workers** for heavy layout calculations
- **More aggressive memoization** in child components

### **5. Accessibility**

- **Complete ARIA labels** from the start
- **Keyboard navigation** for all functionalities
- **Proper screen reader support**

## 🎯 Design Decisions

### **Inspirations**

- **Businessmap**: Zoom controls and navigation
- **Google Calendar**: Drag & drop system and inline editing

### **Color Palette**

- **Smooth gradients** for visual depth
- **Green/Orange/Purple** for item differentiation
- **Neutral grays** for control interface
- **Blue** for interactive elements

### **Layout and Spacing**

- **8px grid system** for consistency
- **Golden ratio** for component proportions
- **Flexbox** for responsive layouts
- **CSS Variables** for theming

### **Interactions**

- **Subtle hover states** for feedback
- **200ms transitions** for smoothness
- **Cursor changes** for clear affordances
- **Loading states** for async operations

## 🧪 How I Would Test With More Time

### **1. Unit Tests**

```javascript
// Example tests I would implement
describe('TimelineItem', () => {
  test('should render item name correctly', () => {
    render(<TimelineItem item={mockItem} />);
    expect(screen.getByText('Item Name')).toBeInTheDocument();
  });

  test('should handle drag operations', () => {
    const onDateChange = jest.fn();
    render(<TimelineItem item={mockItem} onDateChange={onDateChange} />);
    // Simulate drag & drop
    fireEvent.mouseDown(screen.getByRole('button', { name: /resize/ }));
    // Verify callbacks
  });
});
```

### **2. Integration Tests**

- **Complete flows**: Create item → Edit → Move → Delete
- **Component interaction**: Zoom affecting all items
- **Loading states**: Timeline auto-expanding

### **3. E2E Tests with Cypress**

```javascript
// Example E2E test
describe('Timeline Interactions', () => {
  it('should allow dragging items between lanes', () => {
    cy.visit('/');
    cy.get('[data-testid="timeline-item"]').first()
      .drag('[data-testid="lane-2"]');
    cy.get('[data-testid="lane-2"]')
      .should('contain', 'Item Name');
  });
});
```

### **4. Performance Tests**

- **Lighthouse audits** for performance metrics
- **Bundle analysis** for code optimization
- **Memory profiling** for memory leaks
- **Stress testing** with large datasets (1000+ items)

### **5. Accessibility Tests**

- **axe-core** for automated validation
- **Screen reader testing** with NVDA/JAWS
- **Complete keyboard navigation**
- **Color contrast** verification

### **6. Responsiveness Tests**

- **Breakpoints** on different devices
- **Touch interactions** for mobile
- **Orientation changes** portrait/landscape
- **High DPI displays** testing

### **7. Compatibility Tests**

- **Cross-browser** testing (Chrome, Firefox, Safari, Edge)
- **Different OS** (Windows, Mac, Linux)
- **Legacy browser support** if needed

## 📦 Project Structure

```
src/
├── features/timeline/
│   ├── components/
│   │   ├── TimelineContainer/     # Main container
│   │   ├── TimelineItem/         # Individual item
│   │   ├── MonthsHeader/         # Header with months
│   │   └── ZoomControls/         # Zoom controls
│   ├── context/
│   │   └── TimelineContext.jsx   # Global state
│   ├── hooks/
│   │   ├── useTimeline.js        # Main logic
│   │   └── useZoomKeyboardShortcuts.js
│   ├── utils/
│   │   ├── assignLanes.js        # Lane algorithm
│   │   └── timelineCalculations.js
│   └── data/
│       └── timelineItems.js      # Sample data
├── App.jsx                       # Root component
└── index.js                     # Entry point
```

## 🛠 Technologies Used

- **React 18**: Hooks, Context API, Concurrent Features
- **Date-fns**: Date manipulation
- **CSS3**: Grid, Flexbox, Transforms, Animations
- **Parcel**: Build tool and dev server
- **JavaScript ES6+**: Async/await, Destructuring, Modules

## 📈 Future Improvements

- [ ] **Dark/Light Theme Mode**
- [ ] **Export** (PNG, SVG, PDF)
- [ ] **Pre-defined timeline templates**
- [ ] **Real-time collaboration**
- [ ] **Undo/Redo system**
- [ ] **Filters and search**
- [ ] **External API integration**
- [ ] **Mobile-first redesign**

---

**Developed with ❤️ by [Jonas Deyvid]**  
*Development time: ~4 hours*  
*Features implemented: 100% of requested + extras*
