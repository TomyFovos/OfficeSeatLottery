import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function useEmployees(user) {
  const [employeeList, setEmployeeList] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])

  useEffect(() => {
    // 非管理者の場合は自分の社員番号を設定
    if (!user?.adminFlag && user?.employeeNumber) {
      setSelectedEmployees([user.employeeNumber])
      return
    }

    // 管理者の場合は社員リストを取得
    if (user?.adminFlag) {
      fetchEmployees()
    }
  }, [user])

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/user/login')
      if (res.ok) {
        const data = await res.json()
        setEmployeeList(data)
      } else {
        throw new Error('Failed to fetch employees')
      }
    } catch (_error) {
      toast.error('社員リストの取得に失敗しました')
      setEmployeeList([])
    }
  }

  return {
    employeeList,
    selectedEmployees,
    setSelectedEmployees,
    isAdmin: user?.adminFlag
  }
}
