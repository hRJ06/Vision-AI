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
import { redirect } from "next/navigation";

export default function Component() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: "", // Added id for editing
    name: "",
    email: "",
    role: "Read",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for tracking edit mode

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) redirect("/auth");
      const users = await getUsers(token as string);
      setEmployees(users);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (id, role) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === id ? { ...employee, role } : employee
      )
    );
  };

  const handleEditEmployee = (id) => {
    const employee = employees.find((e) => e.id === id);
    setNewEmployee({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setIsEditing(true); // Set editing mode to true
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        action: <ToastAction altText="Log in">Log in</ToastAction>,
      });
      return;
    }

    try {
      if (isEditing) {
        // If editing an existing employee
        await editUser({
          id: newEmployee.id,
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role as "Read" | "Write",
        });
        toast({
          variant: "success",
          title: "Employee updated successfully",
        });
      } else {
        // If adding a new employee
        await addUser({
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role as "Read" | "Write",
          token: token as string,
        });
        toast({
          variant: "success",
          title: "Employee added successfully",
        });
      }

      // Close the dialog and refresh the employee list
      setIsModalOpen(false);
      const users = await getUsers(token as string);
      setEmployees(users);
      setIsEditing(false); // Reset edit mode
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
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button
          onClick={() => {
            setIsEditing(false); // Ensure adding mode is selected
            setIsModalOpen(true);
          }}
        >
          Add Employee
        </Button>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Select
                    value={employee.role}
                    onValueChange={(role) =>
                      handleRoleChange(employee.id, role)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Read">Read</SelectItem>
                      <SelectItem value="Write">Write</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => handleEditEmployee(employee.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
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
                id="role"
                value={newEmployee.role}
                onValueChange={(role) =>
                  setNewEmployee((prev) => ({ ...prev, role }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
              {isEditing ? "Save Changes" : "Save"}
            </Button>
            <div>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
