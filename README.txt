How to run:
1. Copy .env.local.example to .env.local
2. Fill in your 1C OData URL and credentials
3. Run:
   npm install
   npm run dev
4. Open http://localhost:3000

Important:
- Verify ONEC_ODATA_ENDPOINT matches your exact 1C OData entity.
- Verify ONEC_FIELD_* names match the actual fields returned by your 1C OData.
