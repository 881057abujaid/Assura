# Assura Reusable Design System Documentation

Welcome to the **Assura** design system. All primitive components are generic, accessible, support dark mode out of the box, and reside under [src/components/ui/](file:///c:/MERN%20Projects/Assura/client/src/components/ui/).

Import components cleanly:
```jsx
import { Button, Card, Badge, Input } from '../components/ui';
```

---

## 1. Typography
Resides in [Typography.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Typography.jsx)

### Heading
Used for title headers. Supports `h1` to `h6` sizing variants.
```jsx
<Heading as="h1" variant="h1">Main Title</Heading>
<Heading as="h3" variant="h3">Sub Section Header</Heading>
```

### Text
For standard body copy. Supports sizes `sm`, `md`, `lg` and colors `normal`, `muted`, `dim`.
```jsx
<Text size="md" variant="normal">Standard paragraph text.</Text>
<Text size="sm" variant="muted">Secondary descriptive copy.</Text>
```

### Label
Capitalized form element labels.
```jsx
<Label htmlFor="email-input">Work Email Address</Label>
```

### Caption
Subtitles or input error messages.
```jsx
<Caption variant="error">This field is required.</Caption>
<Caption variant="success">Sync completed successfully.</Caption>
```

---

## 2. Buttons & Inputs

### Button
Resides in [Button.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Button.jsx)
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`
- **Sizes**: `sm`, `md`, `lg`
- **States**: `loading`, `disabled`
```jsx
<Button variant="primary" size="md">
  Standard Button
</Button>

<Button variant="danger" loading={true}>
  Deleting Profile...
</Button>
```

### Input
Resides in [Input.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Input.jsx)
- **Props**: `label`, `error`, `iconLeft`, `iconRight`, `disabled`, and native `<input>` bindings.
```jsx
<Input 
  label="Email Address"
  type="email"
  placeholder="name@assura.com"
  iconLeft={<Mail className="h-4 w-4" />}
/>

<Input 
  label="Password"
  type="password"
  error="Password must be at least 6 characters long."
  iconRight={<Lock className="h-4 w-4" />}
/>
```

### Textarea
Resides in [Textarea.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Textarea.jsx)
```jsx
<Textarea 
  label="Claims Summary" 
  rows={6}
  placeholder="Explain the damage details here..."
/>
```

### SearchInput
Resides in [SearchInput.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/SearchInput.jsx)
```jsx
<SearchInput 
  value={searchValue} 
  onChange={(e) => setSearchValue(e.target.value)} 
  onClear={() => setSearchValue('')}
  placeholder="Search database records..."
/>
```

---

## 3. Containers & Data Panels

### Card
Resides in [Card.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Card.jsx)
- **Variants**: `default`, `outline`, `glass`, `flat`
```jsx
<Card variant="glass">
  <CardHeader>
    <CardTitle>Metric Overview</CardTitle>
    <CardDescription>Premium income overview this month.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card body content details...</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Accept</Button>
  </CardFooter>
</Card>
```

### Badge
Resides in [Badge.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Badge.jsx)
- **Variants**: `neutral`, `primary`, `success`, `warning`, `danger`
- **Sizes**: `sm`, `md`
```jsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="danger">Destructive</Badge>
```

### Spinner
Resides in [Spinner.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Spinner.jsx)
```jsx
<Spinner size="md" />
```

### Skeleton
Resides in [Skeleton.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Skeleton.jsx)
```jsx
{/* Loading skeleton for text titles */}
<Skeleton variant="rectangle" width="100%" height="24px" />

{/* Loading skeleton for profile circular images */}
<Skeleton variant="circle" width="48px" height="48px" />
```

### EmptyState
Resides in [EmptyState.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/EmptyState.jsx)
```jsx
<EmptyState
  icon={<Activity className="h-10 w-10" />}
  title="No claims registered"
  description="This policy does not have any active claims history."
  action={<Button variant="outline">Create Claim</Button>}
/>
```

### Avatar
Resides in [Avatar.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Avatar.jsx)
```jsx
<Avatar src="https://example.com/avatar.jpg" name="John Doe" size="lg" />
<Avatar name="Sarah Connor" size="md" /> {/* Renders SC fallback initials */}
```

### Divider
Resides in [Divider.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Divider.jsx)
```jsx
<Divider />
<Divider orientation="vertical" />
<Divider>OR CONTINUE WITH</Divider>
```

---

## 4. Overlay & Navigation

### Alert
Resides in [Alert.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Alert.jsx)
- **Variants**: `info`, `success`, `warning`, `error`
```jsx
<Alert variant="warning" title="Warning Override" onClose={() => alert('dismissed')}>
  Supervisory approval is required to approve this claim limit.
</Alert>
```

### Tooltip
Resides in [Tooltip.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Tooltip.jsx)
```jsx
<Tooltip content="Upload documents in PDF format" position="top">
  <button>Upload File</button>
</Tooltip>
```

### Modal
Resides in [Modal.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Modal.jsx)
```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload contract docs" size="md">
  <div>
    <p>Modal body content goes here.</p>
    <Input label="Contract Name" placeholder="Signed agreement" />
  </div>
</Modal>
```

### ConfirmDialog
Resides in [ConfirmDialog.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/ConfirmDialog.jsx)
```jsx
<ConfirmDialog
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Delete Database Record?"
  description="This operation is permanent. It will delete this record from all nodes."
  variant="danger"
  confirmText="Permanently Delete"
/>
```

### Breadcrumb
Resides in [Breadcrumb.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/Breadcrumb.jsx)
```jsx
<Breadcrumb 
  items={[
    { label: 'Portal', path: '/dashboard' },
    { label: 'Claims Ledger', path: '/claims' },
    { label: 'Claim Detail' }
  ]}
/>
```

### GenericTable
Resides in [GenericTable.jsx](file:///c:/MERN%20Projects/Assura/client/src/components/ui/GenericTable.jsx)
```jsx
const columns = [
  { key: 'id', header: 'Reference ID', sortable: true },
  { key: 'name', header: 'Client Name', sortable: true },
  { 
    key: 'status', 
    header: 'Status Badge',
    render: (row) => <Badge variant={row.status === 'Paid' ? 'success' : 'warning'}>{row.status}</Badge> 
  }
];

const data = [
  { id: '1001', name: 'John Doe', status: 'Paid' },
  { id: '1002', name: 'Sarah Connor', status: 'Pending' }
];

<GenericTable 
  columns={columns} 
  data={data} 
  sortKey="name" 
  sortOrder="asc" 
  onSort={(key, order) => console.log('Sort triggered:', key, order)}
/>
```
