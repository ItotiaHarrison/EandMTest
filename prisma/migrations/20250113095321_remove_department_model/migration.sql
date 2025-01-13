/*
  Warnings:

  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_departmentId_fkey";

-- DropTable
DROP TABLE "departments";
