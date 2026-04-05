import { useState, useEffect, useCallback } from "react";
import { recordsAPI } from "../services/api";
import toast from "react-hot-toast";

export function useRecords(filters = {}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit, sortBy: "date", sortOrder: "desc" };
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const res = await recordsAPI.getAll(params);
      // handle { records: [...], total: N } or direct array
      const data = res.data?.records || res.data || [];
      setRecords(Array.isArray(data) ? data : []);
      setTotal(res.data?.total || data.length || 0);
    } catch (err) {
      toast.error("Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filters.type, filters.category, filters.search, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const createRecord = async (data) => {
    try {
      await recordsAPI.create(data);
      toast.success("Record added");
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create record");
      throw err;
    }
  };

  const updateRecord = async (id, data) => {
    try {
      await recordsAPI.update(id, data);
      toast.success("Record updated");
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update record");
      throw err;
    }
  };

  const deleteRecord = async (id) => {
    try {
      await recordsAPI.delete(id);
      toast.success("Record deleted");
      fetchRecords();
    } catch (err) {
      toast.error("Failed to delete record");
      throw err;
    }
  };

  return {
    records,
    loading,
    total,
    page,
    setPage,
    limit,
    createRecord,
    updateRecord,
    deleteRecord,
    refresh: fetchRecords,
  };
}
