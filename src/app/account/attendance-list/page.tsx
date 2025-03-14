"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '../Loading';

interface AttendanceListProps {
 _id:string,
 clsName:string,
 clsStartAt:string,
 clsEndAt:string,
 clsDate:Date,
 coNick:string,
 bthId:string,
 bthName:string,
 bthJoiners:Number
}

const AttendanceList : React.FC<AttendanceListProps> = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clsData, setClsData] = useState<AttendanceListProps[] | null>([]);
  const data = React.useMemo(() => clsData ?? [], [clsData]);
  const columns = React.useMemo(() => [
    { header: 'Course', accessorKey: 'coNick'},
    { header: 'Batch', accessorKey: 'bthName'},
    { header: 'Class', accessorKey: 'clsName'},
    { header: 'Date', accessorKey: 'clsDate'},
    { header: 'Starts At', accessorKey: 'clsStartAt'},
    { header: 'Ends At', accessorKey: 'clsEndAt'},
    { header: 'Joiners', accessorKey: 'bthJoiners'},
    { header: 'Present', accessorKey: 'clsPresent'},
    { header: 'Absent', accessorKey: 'clsAbsent'},
    { header: 'Action', accessorKey: 'atdAction', 
        cell: ({ row }: { row: any }) => ( 
          <div className='flex items-center justify-center'> 
            <button type='button' title='View' onClick={()=> router.push(`/account/attendance-list/${row.original.bthId}/${row.original._id}/attendees`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          </div> 
        ), 
      },
  ], []);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [filtered, setFiltered] = React.useState('');
    const [pageInput, setPageInput] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(25);

    const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
      return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
    };

    useEffect(() => {
    async function fetchBatchData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/classes`, { cache: "no-store" });
        const classData = await res.json();
        
        let updatedClassList: AttendanceListProps[] = classData.clsList.flatMap((item: any) => {
          const coNick = item.corId?.coNick || "";
          const bthId = item.bthId?._id || "";
          const bthName = item.bthId?.bthName || "";
          const joiners=item.joinersCount;
          
          return item.clsName.filter((a:any) => a.isActive).map((clsItem: any) => ({
            _id: clsItem._id,
            bthId:bthId,
            clsName: clsItem.clsDay || "", 
            clsStartAt: clsItem.clsStartAt || "",
            clsEndAt: clsItem.clsEndAt || "", 
            clsDate: clsItem.clsDate ? new Date(clsItem.clsDate) : new Date(),
            coNick,
            bthName,
            bthJoiners: joiners || 0, 
            clsPresent:clsItem.presentCount,
            clsAbsent:clsItem.absentCount
          }));
        });
    
        setClsData(updatedClassList);
        console.log(updatedClassList);
      } catch (error) {
          console.error("Error fetching class data:", error);
      } finally {
          setIsLoading(false);
      }
    }
    fetchBatchData();
    }, []);
  
    const table = useReactTable(
      {
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(), 
        getPaginationRowModel: getPaginationRowModel(), 
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: globalFilterFn,
        state: {
          sorting: sorting,
          globalFilter: filtered,
          pagination: { pageIndex: pageInput - 1, pageSize: 25 }
        },
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setFiltered
      }
    );
  
    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const page = e.target.value ? Number(e.target.value) - 1 : 0; 
      setPageInput(Number(e.target.value)); 
      table.setPageIndex(page); 
    };

    if(isLoading){
      return <div>
        <Loading/>
      </div>
    }

  return (
    <div>
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <select className='inputBox w-[300px]'>--- Select Course ---</select>
            <select className='inputBox w-[300px]'>--- Select Batch ---</select>
          </div>
          <div className='flex gap-2 items-center'>
            <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className='overflow-auto max-h-[412px]'>
        <DataTable  table={table}/>
      </div> 
      <div>
        <div className='flex mt-4 gap-1'>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(1); table.setPageIndex(0); }}>{"<<"}</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.max(prev - 1, 1)); table.previousPage(); }} disabled={!table.getCanPreviousPage()}>Previous</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.min(prev + 1, table.getPageCount())); table.nextPage(); }} disabled={!table.getCanNextPage()}>Next</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(table.getPageCount()); table.setPageIndex(table.getPageCount() - 1); }}>{">>"}</button>
        </div>
        <div className='flex mt-4 items-center justify-between'>
          <div className='flex flex-col'>
            <p className='italic'>Total Pages: &nbsp; {table.getPageCount()}</p>
            <p className='italic'>You are on page: &nbsp; {(table.options.state.pagination?.pageIndex ?? 0) + 1}</p>
          </div>
          <div className='flex gap-1 items-center'>
            <p className='italic'>Jump to page: &nbsp;</p>
            <input type='number' className='px-2 py-1 rounded-lg border-[1.5px] border-black w-[70px] inline' value={pageInput} onChange={handlePageChange} min={1} max={table.getPageCount()}/>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default AttendanceList;
