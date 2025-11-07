/*
  Warnings:

  - A unique constraint covering the columns `[ship_id,year]` on the table `ship_compliance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ship_compliance_ship_id_year_key" ON "ship_compliance"("ship_id", "year");
