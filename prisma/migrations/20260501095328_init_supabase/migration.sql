-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grid" (
    "id" TEXT NOT NULL,
    "gridNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCell" (
    "id" TEXT NOT NULL,
    "gridId" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "rowType" TEXT NOT NULL,
    "rowValue" TEXT NOT NULL,
    "sampleAnswer" TEXT,
    "colType" TEXT NOT NULL,
    "colValue" TEXT NOT NULL,

    CONSTRAINT "GridCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gridId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "timeTakenSeconds" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GridSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellAnswer" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "llmReasoning" TEXT,
    "suggestedAnswer" TEXT,

    CONSTRAINT "CellAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_identifier_value_key" ON "Verification"("identifier", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Grid_gridNumber_key" ON "Grid"("gridNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Grid_date_key" ON "Grid"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GridCell_gridId_row_col_key" ON "GridCell"("gridId", "row", "col");

-- CreateIndex
CREATE UNIQUE INDEX "GridSubmission_userId_gridId_key" ON "GridSubmission"("userId", "gridId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCell" ADD CONSTRAINT "GridCell_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridSubmission" ADD CONSTRAINT "GridSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridSubmission" ADD CONSTRAINT "GridSubmission_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAnswer" ADD CONSTRAINT "CellAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "GridSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellAnswer" ADD CONSTRAINT "CellAnswer_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "GridCell"("id") ON DELETE CASCADE ON UPDATE CASCADE;
