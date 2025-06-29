-- CreateTable
CREATE TABLE "M_SEAT" (
    "seatId" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "imageX" INTEGER NOT NULL,
    "imageY" INTEGER NOT NULL,

    CONSTRAINT "M_SEAT_pkey" PRIMARY KEY ("seatId")
);

-- CreateTable
CREATE TABLE "M_SEAT_APPOINT" (
    "id" SERIAL NOT NULL,
    "appointId" INTEGER NOT NULL,
    "seatId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3),

    CONSTRAINT "M_SEAT_APPOINT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "T_SEAT_POSITION" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "seatId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3),

    CONSTRAINT "T_SEAT_POSITION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "M_USER" (
    "userId" SERIAL NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "showName" TEXT,
    "password" TEXT NOT NULL,
    "adminFlag" BOOLEAN NOT NULL,
    "deleteFlag" BOOLEAN NOT NULL,

    CONSTRAINT "M_USER_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "M_SEAT_status_idx" ON "M_SEAT"("status");

-- CreateIndex
CREATE INDEX "M_SEAT_tableId_idx" ON "M_SEAT"("tableId");

-- CreateIndex
CREATE INDEX "M_SEAT_APPOINT_seatId_idx" ON "M_SEAT_APPOINT"("seatId");

-- CreateIndex
CREATE INDEX "M_SEAT_APPOINT_userId_idx" ON "M_SEAT_APPOINT"("userId");

-- CreateIndex
CREATE INDEX "T_SEAT_POSITION_date_idx" ON "T_SEAT_POSITION"("date");

-- CreateIndex
CREATE INDEX "T_SEAT_POSITION_seatId_idx" ON "T_SEAT_POSITION"("seatId");

-- CreateIndex
CREATE INDEX "T_SEAT_POSITION_userId_idx" ON "T_SEAT_POSITION"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "T_SEAT_POSITION_date_userId_key" ON "T_SEAT_POSITION"("date", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "M_USER_employeeNumber_key" ON "M_USER"("employeeNumber");

-- CreateIndex
CREATE INDEX "M_USER_employeeNumber_idx" ON "M_USER"("employeeNumber");

-- AddForeignKey
ALTER TABLE "M_SEAT_APPOINT" ADD CONSTRAINT "M_SEAT_APPOINT_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "M_SEAT"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "M_SEAT_APPOINT" ADD CONSTRAINT "M_SEAT_APPOINT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "M_USER"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_SEAT_POSITION" ADD CONSTRAINT "T_SEAT_POSITION_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "M_SEAT"("seatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "T_SEAT_POSITION" ADD CONSTRAINT "T_SEAT_POSITION_userId_fkey" FOREIGN KEY ("userId") REFERENCES "M_USER"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

