/*
  Warnings:

  - You are about to drop the column `loc` on the `Property` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to drop the column `loc` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - Added the required column `city` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "area" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "img" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("area", "baths", "beds", "category", "country", "createdAt", "id", "img", "price", "rating", "status", "title", "updatedAt") SELECT "area", "baths", "beds", "category", "country", "createdAt", "id", "img", "price", "rating", "status", "title", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "battery" INTEGER,
    "range" INTEGER,
    "power" TEXT,
    "rating" REAL,
    "img" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Vehicle" ("battery", "category", "country", "createdAt", "id", "img", "power", "price", "range", "rating", "status", "title", "updatedAt") SELECT "battery", "category", "country", "createdAt", "id", "img", "power", "price", "range", "rating", "status", "title", "updatedAt" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
