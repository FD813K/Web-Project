# CoursePortal backend

## Configure MongoDB Atlas

From the project root, copy `backend/.env.example` to `backend/.env`. Replace
the URI placeholders with the Atlas username, cluster address, and
URL-encoded database-user password. Keep `backend/.env` local; it is ignored by
Git. The database user should have `readWrite` access to the `marketplace`
database, and Atlas must allow connections from your current IP address.

## Run locally

Install dependencies from the project root:

```powershell
npm run install:all
```

In separate terminals, start the backend and frontend:

```powershell
npm run backend
npm run dev
```

The backend connects to MongoDB before listening on port 5000. Check
`http://localhost:5000/api/health` for the database connection status. The
frontend uses `http://localhost:5000` by default; override it with
`VITE_API_BASE_URL` in `frontend/.env`.

Product records support listing, lookup, create, update, and delete operations
under `/api/products`. User registration and credential verification are
available under `/api/users`; passwords are stored as scrypt hashes.

The simplified customer page submits an order with a typed product name and
quantity; the product does not need to exist in the product catalog. The order
API remains available under:

- `POST /api/orders`, `GET /api/orders`, and `DELETE /api/orders/:orderNumber`

Other customer-related API endpoints remain available:

- `PUT /api/customer/account`
- `POST /api/customer/complaints` and `GET /api/customer/complaints/:complaintId`
- `POST /api/complaints`, `GET /api/complaints`, and `PATCH /api/complaints/:complaintId`
- `POST /api/contact`

The shareholder forms use `POST`, `GET`, `PATCH`, and `DELETE` under
`/api/shareholder/investments`, plus `GET /api/shareholder/dividends`. The
current UI has no dividend-creation form, so the review page displays only
dividend records already present in MongoDB.

Authentication tokens and role authorization are intentionally not implemented
in this coursework stage. Product administration, complaint processing,
customer records, orders, investments, and dividend records are not protected
by user identity. Do not deploy this API with real customer or financial data
until those routes have backend authorization. Order-list responses omit the
shipping address; shipping addresses are stored only with orders, not in the
customer-account record.
