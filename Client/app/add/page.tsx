"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addUser, editUser, getUsers } from "@/lib/actions/organization.action";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Employee } from "@/types";
import Link from "next/link";
import SkeletonLoader from "@/components/SkeletonLoader";
import cookie from "js-cookie";
import { Edit2 } from "lucide-react";
import { MdDelete, MdEdit } from "react-icons/md";
export default function Component() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    role: "Read",
  });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = cookie.get("token");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        router.push("/auth");
        return;
      }
      setLoading(true);
      try {
        const users = await getUsers(token as string);
        setEmployees(users as any);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router, token]);

  const handleEditEmployee = (employee: Employee) => {
    setNewEmployee({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    const token = cookie.get("token");
    if (!token) {
      router.push("/auth");
      return;
    }
    try {
      if (isEditing) {
        await editUser({
          id: newEmployee.id,
          token,
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role,
        });
        toast({
          variant: "success",
          title: "Employee updated successfully",
        });
      } else {
        await addUser({
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role,
          token: token as string,
        });
        toast({
          variant: "success",
          title: "Employee added successfully",
        });
      }

      setIsModalOpen(false);
      const users = await getUsers(token as string);
      setEmployees(users as any);
      setIsEditing(false);
      setNewEmployee({
        id: "",
        name: "",
        email: "",
        role: "Read",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Vision AI
          </h1>
          <Button
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
            }}
          >
            ADD
          </Button>
        </div>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-extrabold text-lg">ID</TableHead>
                <TableHead className="font-extrabold text-lg uppercase">
                  Name
                </TableHead>
                <TableHead className="font-extrabold text-lg uppercase">
                  Email
                </TableHead>
                <TableHead className="font-extrabold text-lg uppercase">
                  Role
                </TableHead>
                <TableHead className="font-extrabold text-lg uppercase">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 15 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <SkeletonLoader width="2.5rem" height="1.5rem" />
                      </TableCell>
                      <TableCell>
                        <SkeletonLoader width="8rem" height="1.5rem" />
                      </TableCell>
                      <TableCell>
                        <SkeletonLoader width="10rem" height="1.5rem" />
                      </TableCell>
                      <TableCell>
                        <SkeletonLoader width="6rem" height="1.5rem" />
                      </TableCell>
                      <TableCell>
                        <SkeletonLoader width="5rem" height="1.5rem" />
                      </TableCell>
                    </TableRow>
                  ))
                : employees.map((employee, index) => (
                    <TableRow key={employee.id}>
                      <TableCell className="text-lg">{index + 1}</TableCell>
                      <TableCell className="text-lg font-bold">{employee.name}</TableCell>
                      <TableCell className="text-lg">
                        {(() => {
                          const [localPart, domainPart] =
                            employee.email.split("@");
                          return (
                            <>
                              {localPart}@
                              <span className="font-bold">{domainPart}</span>
                            </>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-lg">
                        <div className="flex items-center">
                          <div className="flex items-center bg-gray-200 px-2 py-1 rounded-full">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 animate-blink ${
                                employee.role != "Read"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            ></span>
                            <span
                              className={`text-sm font-semibold uppercase tracking-wider ${
                                employee.role != "Read"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {employee.role}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-x-2 ">
                          <div
                            className="bg-black text-white p-2 rounded-md"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            {" "}
                            <MdEdit />
                          </div>
                          <div className="bg-red-500 text-white p-2 rounded-md">
                            {" "}
                            <MdDelete />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Vision AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/terms"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newEmployee.role}
                onValueChange={(value) =>
                  setNewEmployee((prev) => ({
                    ...prev,
                    role: value as "Read" | "Write",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue>{newEmployee.role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Read">Read</SelectItem>
                  <SelectItem value="Write">Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEmployee}>
              {isEditing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
