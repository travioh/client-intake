# Client intake form

The intake questionnaire for paid media performance audits, Travis Tae Oh, PhD (Apex Solution Consulting). One page, one section per screen, and responses go to a Google Sheet.

## Sending it to a client

Add the client's name to the link:

```
https://travioh.github.io/client-intake/?client=pawville
```

- `client` tags their row in the sheet and shows "Prepared for Pawville" on the welcome screen.
- To control the display name exactly, add `&name=Pawville%20Pet%20Resort`.
- Without `?client=`, responses are tagged `general`.

## Where responses go

Each submission adds one row to the **Responses** tab of the [Client Intake Responses](https://docs.google.com/spreadsheets/d/13J3jzqeL5zIKWBVJib1VjYfPVqOLy0GRBPzFB7cfMSc/edit) Google Sheet, and an email alert goes to travis.oh@apexsolutionconsulting.com. Column names match the question numbers (P1_name, A1, B2, … G6). The **Questions** tab lists what each column means.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The form. Questions live in the `SECTIONS` list near the bottom; settings in `CONFIG`. |
| `apps-script/Code.gs` | The script inside the Google Sheet that receives submissions. Kept here as a backup copy. |

## Editing questions

1. Edit the question in `SECTIONS` in `index.html` and commit. GitHub Pages updates in about a minute.
2. Keep the question ID (A1, B2…) the same if the meaning is the same, so old and new answers stay in one column.
3. A new ID automatically gets a new column in the sheet. Add a line for it on the Questions tab.

## Settings in `CONFIG`

- `endpoint`: the Apps Script web app URL. Empty means preview mode, so nothing is sent.
- `metaPortfolioId`: Apex's Meta Business portfolio ID, shown in the access checklist once set.
- `contactEmail` / `auditorEmail`: the address shown to clients and used for access requests.

## If the Apps Script is redeployed

Use **Deploy → Manage deployments → Edit → New version** so the URL stays the same. A brand-new deployment creates a new URL, which then has to be pasted into `CONFIG.endpoint`.
