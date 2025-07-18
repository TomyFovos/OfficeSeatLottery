"use client"

import { ja } from "date-fns/locale"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEmployees } from "@/hooks/use-all-employees"

// 曜日データを外部に移動
const weekdays = [
  { id: "monday", label: "月", value: "monday" },
  { id: "tuesday", label: "火", value: "tuesday" },
  { id: "wednesday", label: "水", value: "wednesday" },
  { id: "thursday", label: "木", value: "thursday" },
  { id: "friday", label: "金", value: "friday" },
]

// 予約処理のカスタムフック
const useReservation = () => {
  const [reservationError, setReservationError] = useState(null)

  const makeReservation = async (reservationData) => {
    try {
      setReservationError(null)
      
      const response = await fetch('/api/seats/appoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      const result = await response.json()
      
      if (response.ok) {
        return { success: true, message: '予約が正常に登録されました' }
      } 
        setReservationError(result.error)
        return { success: false, error: result.error }
      
    } catch (_error) {
      const errorMessage = '予約登録中にエラーが発生しました'
      setReservationError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return { makeReservation, reservationError, setReservationError }
}

// 日付フォーマット用のユーティリティ関数
const formatDateRange = (range) => {
  if (!range || !range.from) return ""
  if (!range.to || range.from.getTime() === range.to.getTime()) {
    return range.from.toLocaleDateString("ja-JP")
  } 
  return `${range.from.toLocaleDateString("ja-JP")} 〜 ${range.to.toLocaleDateString("ja-JP")}`
}

// 曜日予約コンポーネント
const WeeklyReservationTab = ({ 
  selectedEmployees, 
  selectedDays, 
  setSelectedDays, 
  selectedSeatIds, 
  onReservation, 
  onBack,
  reservationError 
}) => {
  const handleDayChange = (dayValue, checked) => {
    if (checked) {
      setSelectedDays([...selectedDays, dayValue])
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== dayValue))
    }
  }

  const isFormValid = selectedEmployees.length > 0 && selectedDays.length > 0

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>曜日（毎週）</Label>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={selectedDays.includes(day.value)}
                  onCheckedChange={(checked) => handleDayChange(day.value, checked)}
                />
                <Label
                  htmlFor={day.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {isFormValid && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>選択内容:</strong> 毎週 {selectedDays.map((day) => weekdays.find((w) => w.value === day)?.label).join("、")}曜日
            </p>
            <p className="text-sm">
              <strong>座席数:</strong> {selectedSeatIds.length}席
            </p>
          </div>
        )}

        <ReservationActions
          isFormValid={isFormValid}
          onReservation={onReservation}
          onBack={onBack}
          reservationError={reservationError}
          buttonText="曜日予約を確定"
        />
      </div>
    </div>
  )
}

// 日付予約コンポーネント
const DateReservationTab = ({ 
  selectedEmployees, 
  dateRange, 
  setDateRange, 
  selectedSeatIds, 
  onReservation, 
  onBack,
  reservationError 
}) => {
  const isFormValid = selectedEmployees.length > 0 && dateRange && (
    (dateRange.from && !dateRange.to) || 
    (dateRange.from && dateRange.to)
  )

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>日付を選択（単日または期間選択可能）</Label>
          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              locale={ja}
              numberOfMonths={2}
              className="rounded-md border"
            />
          </div>
        </div>

        {isFormValid && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>選択期間:</strong> {formatDateRange(dateRange)}
            </p>
            <p className="text-sm">
              <strong>座席数:</strong> {selectedSeatIds.length}席
            </p>
          </div>
        )}

        <ReservationActions
          isFormValid={isFormValid}
          onReservation={onReservation}
          onBack={onBack}
          reservationError={reservationError}
          buttonText="日付予約を確定"
        />
      </div>
    </div>
  )
}

// 予約アクション共通コンポーネント
const ReservationActions = ({ 
  isFormValid, 
  onReservation, 
  onBack, 
  reservationError, 
  buttonText 
}) => {
  return (
    <div className="pt-4 space-y-2">
      <div className="flex gap-2">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          座席選択に戻る
        </Button>
        <Button
          onClick={onReservation}
          disabled={!isFormValid}
          className="flex-1"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default function ReservationTabs({ selectedSeatIds = [], onBack }) {
  const { data: session } = useSession()
  const user = session?.user
  
  const [selectedDays, setSelectedDays] = useState([])
  const [dateRange, setDateRange] = useState()
  
  const { employeeList, selectedEmployees, setSelectedEmployees } = useEmployees(user)
  const { makeReservation, reservationError } = useReservation()

  const maxSelectableEmployees = selectedSeatIds.length > 0 ? selectedSeatIds.length : 1

  const handleEmployeeSelectionChange = (newSelection) => {
    if (newSelection.length <= maxSelectableEmployees) {
      setSelectedEmployees(newSelection)
    }
  }

  const handleWeeklyReservation = async () => {
    const result = await makeReservation({
      selectedEmployees,
      selectedDays,
      selectedSeatIds
    })
    
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(`エラー: ${result.error}`)
    }
  }

  const handleDateReservation = async () => {
    const result = await makeReservation({
      selectedEmployees,
      dateRange,
      selectedSeatIds
    })
    
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(`エラー: ${result.error}`)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>予約システム</CardTitle>
          <CardDescription>
            選択座席数: {selectedSeatIds.length}席 | 選択可能社員数: 最大{maxSelectableEmployees}人
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="reserver">
                予約者名 ({selectedEmployees.length}/{maxSelectableEmployees}人選択中)
              </Label>
              <MultiSelect
                id="employee-select"
                options={employeeList}
                onValueChange={handleEmployeeSelectionChange}
                defaultValue={[]}
                placeholder="社員名を選択してください"
                variant="inverted"
                maxCount={maxSelectableEmployees}
                maxSelections={maxSelectableEmployees}
                className="w-full"
              />
            </div>
          </div>

          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">曜日予約</TabsTrigger>
              <TabsTrigger value="date">日付予約</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
              <WeeklyReservationTab
                selectedEmployees={selectedEmployees}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                selectedSeatIds={selectedSeatIds}
                onReservation={handleWeeklyReservation}
                onBack={onBack}
                reservationError={reservationError}
              />
            </TabsContent>

            <TabsContent value="date">
              <DateReservationTab
                selectedEmployees={selectedEmployees}
                dateRange={dateRange}
                setDateRange={setDateRange}
                selectedSeatIds={selectedSeatIds}
                onReservation={handleDateReservation}
                onBack={onBack}
                reservationError={reservationError}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
