# Documentation Templates

# Component Documentation Template

```markdown
# Component Name

## Overview

Brief description of the component's purpose and functionality.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| prop1 | string | Yes | - | Description |
| prop2 | number | No | 0 | Description |

## Usage

```jsx
import { ComponentName }
    from "./ComponentName";

function App() {

    return (
        <ComponentName
            prop1="value"
            prop2={123}
        />
    );

}
```

## Examples

### Basic Usage

```jsx
<ComponentName prop1="basic" />
```

### Advanced Usage

```jsx
<ComponentName
    prop1="advanced"
    prop2={456}
/>
```

## Styling

- `.component-name`
- `.component-name__element`
- `.component-name--modifier`

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes
- Focus management

## Testing

```jsx
test("renders component", () => {

    render(
        <ComponentName prop1="test" />
    );

    expect(
        screen.getByText("test")
    ).toBeInTheDocument();

});
```

---

# API Endpoint Template

```markdown
# Endpoint Name

## Overview

Brief description of the endpoint's purpose.

## Endpoint

GET /api/endpoint

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| param1 | string | Yes | Description |
| param2 | number | No | Description |

## Request Example

```bash
curl -X GET \
"https://api.example.com/endpoint?param1=value&param2=123" \
-H "Authorization: Bearer token"
```

## Success Response

```json
{
    "success": true,
    "data": {
        "field1": "value1"
    }
}
```

## Error Response

```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Error description"
    }
}
```

## Status Codes

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
```