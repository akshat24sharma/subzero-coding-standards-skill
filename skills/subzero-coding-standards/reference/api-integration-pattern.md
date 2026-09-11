# SubZero API integration pattern (Redux + @am92/web-http)

This is the default pattern when a project uses Redux for server state and
`@am92/web-http` as its HTTP client. If the project's stack differs, see
**Adapting to a different stack** at the bottom before using this template.

## File structure (5 files per feature)

```
src/Redux/{FeatureName}/
├── Actions.ts                  # traceActionsCreator only
├── TYPES.ts                    # State shape (2-3 fields max)
├── Reducer.ts                  # Stores raw API response
├── Selectors.ts                # Field access
└── Services/{api}.Service.ts   # Pure HTTP call, no transformation

src/Pages/{PageName}/hooks/
└── use{FeatureName}.ts         # Combines selectors + actions for components
```

## Critical rules

- **Descriptive interface names**: `I_GET_INVOICES_REQ`, `I_CREATE_INVOICE_RES` — never generic names like `ApiRequest`/`ApiResponse`
- **Raw responses only**: service functions return API data unchanged, no filtering/transforming/reshaping
- **Simple state first**: most features only need `{ data: Response | null }` in their reducer
- **Register every reducer** in the root reducer map (e.g. `combineReducers`)
- **Service name format**: `'{sliceName}/{actionName}'` (e.g. `'invoice/getInvoices'`)
- **Always use the project's configured HTTP client** — never raw `fetch`/`axios`
- **Token rotation**: use the project's authenticated-request wrapper for endpoints that need it
- **Loading state is automatic** if the project has a service-tracking mechanism — never add a manual `isLoading` state alongside it

## Template

### 1. `Actions.ts`

```typescript
import traceActionsCreator from '../traceActionsCreator'
import type { I_GET_INVOICES_RES } from './Services/getInvoices.Service'

export const getInvoicesServiceName = 'invoice/getInvoices'
export const getInvoicesTraceActions = traceActionsCreator<I_GET_INVOICES_RES>(
  getInvoicesServiceName
)

export const createInvoiceServiceName = 'invoice/createInvoice'
export const createInvoiceTraceActions =
  traceActionsCreator<I_CREATE_INVOICE_RES>(createInvoiceServiceName)
```

### 2. `TYPES.ts`

```typescript
import type { I_GET_INVOICES_RES } from './Services/getInvoices.Service'
import type { I_CREATE_INVOICE_RES } from './Services/createInvoice.Service'

export type T_INVOICE_REDUCER = {
  invoices: I_GET_INVOICES_RES | null
  createdInvoice: I_CREATE_INVOICE_RES | null
}

export const INITIAL_STATE: T_INVOICE_REDUCER = {
  invoices: null,
  createdInvoice: null
}
```

### 3. `Reducer.ts`

```typescript
import { createSlice, type CreateSliceOptions } from '@reduxjs/toolkit'

import { getInvoicesTraceActions, createInvoiceTraceActions } from './Actions'
import { SLICE_NAME } from './Selectors'
import { INITIAL_STATE, type T_INVOICE_REDUCER } from './TYPES'

const sliceOptions: CreateSliceOptions<T_INVOICE_REDUCER> = {
  name: SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {
    clearInvoices: state => {
      state.invoices = null
    }
  },
  extraReducers: builder => {
    builder.addCase(getInvoicesTraceActions.success, (state, { payload }) => {
      state.invoices = payload
    })
    builder.addCase(getInvoicesTraceActions.error, state => {
      state.invoices = null
    })
    builder.addCase(createInvoiceTraceActions.success, (state, { payload }) => {
      state.createdInvoice = payload
    })
  }
}

const slice = createSlice(sliceOptions)
export const { clearInvoices } = slice.actions
export default slice.reducer
```

### 4. `Selectors.ts`

```typescript
import { createSelector } from '@reduxjs/toolkit'
import type { TAppStore } from '~/src/Configurations/AppStore'

export const SLICE_NAME = 'invoice'
const select = (state: TAppStore) => state[SLICE_NAME]

export const getInvoicesSelector = createSelector(
  select,
  reducer => reducer.invoices
)

export const getCreatedInvoiceSelector = createSelector(
  select,
  reducer => reducer.createdInvoice
)
```

### 5. `Services/{api}.Service.ts`

```typescript
import type { WebHttpRequestOptions } from '@am92/web-http'

import { getInvoicesServiceName, getInvoicesTraceActions } from '../Actions'
import serviceActionCreator from '~/src/Redux/serviceActionCreator'
import { asHttp } from '~/src/Configurations/WebHttp'

export type I_GET_INVOICES_REQ = {
  accountId: string
  startDate: string
  endDate: string
}

export type I_GET_INVOICES_RES = {
  data: {
    invoices: Array<{ id: string; amount: number; status: string }>
    totalCount: number
  }
}

async function getInvoices(reqData: I_GET_INVOICES_REQ) {
  const options: WebHttpRequestOptions = {
    url: '/invoices/list',
    method: 'POST',
    data: reqData
  }
  const response = await asHttp.request(options)
  const { data: body } = response
  return body // raw response only — no transformation
}

const getInvoicesService = serviceActionCreator<
  I_GET_INVOICES_REQ,
  I_GET_INVOICES_RES
>(getInvoicesTraceActions, getInvoices)

export default getInvoicesService
export { getInvoicesServiceName }
```

### Store registration

```typescript
// src/Redux/Reducers.ts
import InvoiceReducer from './Invoice/Reducer'
import { SLICE_NAME as InvoiceSliceName } from './Invoice/Selectors'
import type { T_INVOICE_REDUCER } from './Invoice/TYPES'

export type TReducers = {
  // ...existing slices
  [InvoiceSliceName]: T_INVOICE_REDUCER
}

const reducers: ReducersMapObject<TReducers> = {
  // ...existing reducers
  [InvoiceSliceName]: InvoiceReducer
}
```

### Custom hook

```typescript
// src/Pages/{PageName}/hooks/useInvoice.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getInvoicesServiceName } from '~/src/Redux/Invoice/Actions'
import { getInvoicesSelector } from '~/src/Redux/Invoice/Selectors'
import getInvoicesService, {
  type I_GET_INVOICES_REQ
} from '~/src/Redux/Invoice/Services/getInvoices.Service'
import { getServiceSelector } from '~/src/Redux/ServiceTracker/Selectors'

import type { TAppDispatch, TAppStore } from '~/src/Configurations/AppStore'

export const useInvoice = () => {
  const dispatch = useDispatch<TAppDispatch>()
  const invoices = useSelector(getInvoicesSelector)

  const isLoadingInvoices = useSelector(
    (state: TAppStore) =>
      getServiceSelector(state, getInvoicesServiceName) === 'LOADING'
  )

  const fetchInvoices = useCallback(
    async (request: I_GET_INVOICES_REQ) => {
      return await dispatch(getInvoicesService(request))
    },
    [dispatch]
  )

  return { invoices, isLoadingInvoices, fetchInvoices }
}
```

### Component usage

```tsx
import { useInvoice } from './hooks/useInvoice'

export const InvoiceDashboard: React.FC = () => {
  const { invoices, isLoadingInvoices, fetchInvoices } = useInvoice()

  useEffect(() => {
    fetchInvoices({ accountId: '123', startDate: '2026-01-01', endDate: '2026-12-31' })
  }, [fetchInvoices])

  if (isLoadingInvoices) {
    return (
      <DsBox sx={{ display: 'flex', justifyContent: 'center' }}>
        <DsLoader />
      </DsBox>
    )
  }

  return (
    <DsStack sx={{ gap: 'var(--ds-spacing-bitterCold)' }}>
      {invoices?.data?.invoices?.map(invoice => (
        <DsTypography key={invoice.id} variant="bodyRegularMedium">
          {invoice.id} — {invoice.amount}
        </DsTypography>
      ))}
    </DsStack>
  )
}
```

## Forbidden patterns

```typescript
// ❌ Manual loading state duplicating an existing tracker
const [isLoading, setIsLoading] = useState(false)

// ❌ Direct fetch/axios instead of the project's HTTP client
const data = await fetch('/api/invoices')
const data = await axios.get('/api/invoices')

// ❌ Business logic / transformation inside a service file
async function getInvoices(reqData) {
  const response = await asHttp.request(options)
  return response.data.invoices.filter(i => i.status === 'active') // no transformation in services
}

// ❌ Generic type names
type ApiRequest = { ... }   // use I_GET_INVOICES_REQ
type ApiResponse = { ... }  // use I_GET_INVOICES_RES

// ❌ useEffect calling fetch directly, bypassing the service/hook layer
useEffect(() => {
  fetch('/api/data').then(res => res.json())
}, [])
```

## Adapting to a different stack

This 5-file pattern assumes Redux + `@am92/web-http`. If the project uses
something else, adapt rather than forcing this structure:

| If the project uses... | Adapt by... |
|---|---|
| `formik` for forms | Use `useFormik` or `<Formik>` + `<Field>` instead of manual form state |
| `react-hook-form` | Use `useForm`, `register`, `handleSubmit`, `Controller` |
| `zod` for validation | Define schemas with `z.object({})`; use `zodResolver` with Formik/RHF |
| `yup` for validation | Define schemas with `yup.object()`; use `yupResolver` or Formik's `validationSchema` |
| `axios` as HTTP client | Use a shared `axios.create()` instance instead of `asHttp` |
| `@tanstack/react-query` for server state | Use `useQuery`/`useMutation` instead of the Redux 5-file pattern entirely |
| `react-router-v7` | Use `useNavigate`, `useParams`, and loader functions for routing-tied data |
| Tailwind for styling | Use Tailwind classes instead of the `sx` prop (DS component usage rules still apply) |

**Rule**: never assume a library is available just because it's common —
confirm against the project's actual `package.json` or stated conventions
before applying that library's pattern.
