CoursePortal forms — teacher reference pattern

Each React form uses React Hook Form to register inputs and handle submission, with a Zod schema connected through `zodResolver` for validation. Number inputs use React Hook Form's `valueAsNumber` and Zod `z.number()` schemas; whole-number fields also use `.int()`. Text fields have character limits: usernames and passwords are limited to 25 characters, general text to 70 characters, and descriptions to 250 characters. Sell retains its tighter product ID (6) and product name (10) limits. Forms that are still demonstrations log submitted values in the browser console; password fields are omitted.

The form pattern matches the teacher's example:

```js
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(formSchema),
});

function myFormSubmissionFunction(data) {
  console.log("Form submitted.", data);
}

<form onSubmit={handleSubmit(myFormSubmissionFunction)}>
  <input {...register("name")} />
  {errors.name && <span>{errors.name.message}</span>}
</form>
```

Start the frontend with `cd frontend`, `npm install`, then `npm run dev`. Product, account, order, complaint, contact, and shareholder investment/dividend forms use the backend API. The dividend page reads database records; the project has no dividend-creation form.

Complaints and My Products now have React routes. Existing HTML URLs for migrated pages forward to their React equivalent. Existing pages, fields, CSS, and createBrowserRouter routing are retained.

Sell keeps the product field limits: ID up to 6 characters, name 2–10 characters, description 10–250 characters, and at least one image.

Login forms verify credentials against the backend before navigating to the corresponding role page. Login currently does not issue a session token, and role pages, product operations, and customer/shareholder data routes are not access-protected.

Form section menus now use Link with URL hashes. useLocation reads the hash and selects one active panel; it also handles direct links, refresh and browser Back/Forward without relying on CSS :target. An empty or unknown hash shows the first form.
