import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

import { MdDeleteForever } from "react-icons/md";
import useOrderData from "../../Hooks/useOrderData";

const Dashboard = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for iqama
  const [otp, setOtp] = useState(""); // Object to hold OTPs for each order
  const [loading] = useState(false); // Loading state
  const [error, setError] = useState("");

  const axiosPublic = useAxiosPublic();

  const { refetch: ordRefetch } = useOrderData();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ["orderList"],
    queryFn: async () => {
      const res = await axiosPublic.get(`orders`);
      return res.data;
    },
  });

  // Set up a refetch interval
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 8000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Show success alert
    Swal.fire({
      position: "top",
      icon: "success",
      title: "Admin logout Successfully",
      showConfirmButton: false,
      timer: 1500,
    });

    // Redirect after the alert is shown
    setTimeout(() => {
      window.location.href = "/login"; // Adjust based on your routing
    }, 1500); // 1500 ms delay to match the SweetAlert timer
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected orders?"
    );
    if (!confirmDelete) return;

    try {
      await axiosPublic.delete("deleteOrder", {
        data: { ids: selectedOrders }, // Send the selected order IDs in the body
      });

      setSelectedOrders([]); // Clear the selected orders
    } catch (error) {
      console.error("Error deleting orders:", error);
      setError(
        error.response
          ? error.response.data.message
          : "Failed to delete orders."
      );
    }
  };

  // Filter and sort orders based on the search term and orderDate
  const filteredOrders = orders
    .filter((order) =>
      order.iqama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`deleteOrder/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                timer: 1500,
              });
              refetch();
            }
          })
          .catch((error) => {
            console.error("Error deleting order:", error);
            Swal.fire({
              title: "Error!",
              text: "There was a problem deleting the order.",
              icon: "error",
            });
          });
      }
    });
  };

  // otp1
  const handleOtp1Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], otp1: parseInt(value) }, // Store otp1 for each order
    }));
  };

  const handleOtp1Submit = (id) => {
    const otp1Value = otp[id]?.otp1;
    console.log("otp1 for order", id, ":", otp1Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { otp1: otp1Value })
      .then((response) => {
        console.log("otp1 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleOtp1Change(id, "");

        ordRefetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating otp1:", error);
      });
  };
  // otp2
  const handleOtp2Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], otp2: parseInt(value) }, // Store otp1 for each order
    }));
  };

  const handleOtp2Submit = (id) => {
    const otp2Value = otp[id]?.otp2;
    console.log("otp2 for order", id, ":", otp2Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { otp2: otp2Value })
      .then((response) => {
        console.log("otp2 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleOtp2Change(id, "");

        ordRefetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating otp2:", error);
      });
  };
  // otp3
  const handleOtp3Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], otp3: parseInt(value) }, // Store otp1 for each order
    }));
  };

  const handleOtp3Submit = (id) => {
    const otp3Value = otp[id]?.otp3;
    console.log("otp2 for order", id, ":", otp3Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { otp3: otp3Value })
      .then((response) => {
        console.log("otp3 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleOtp3Change(id, "");

        ordRefetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating otp3:", error);
      });
  };

  // nafath 1 set
  const handleNafath1Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], nafath1: parseInt(value) }, // Store Nafath1 for each order
    }));
  };

  const handleNafath1Submit = (id) => {
    const nafath1Value = otp[id]?.nafath1;
    console.log("Nafath1 for order", id, ":", nafath1Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { nafath1: nafath1Value })
      .then((response) => {
        console.log("Nafath1 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleNafath1Change(id, "");

        ordRefetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating Nafath1:", error);
      });
  };

  // Function to handle Nafath2
  const handleNafath2Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], nafath2: parseInt(value) }, // Store Nafath2 for each order
    }));
  };

  const handleNafath2Submit = (id) => {
    const nafath2Value = otp[id]?.nafath2;
    console.log("Nafath2 for order", id, ":", nafath2Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { nafath2: nafath2Value })
      .then((response) => {
        console.log("Nafath2 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleNafath2Change(id, "");
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating Nafath2:", error);
      });
  };

  // Function to handle Nafath3
  const handleNafath3Change = (id, value) => {
    setOtp((prevOtp) => ({
      ...prevOtp,
      [id]: { ...prevOtp[id], nafath3: parseInt(value) }, // Store Nafath3 for each order
    }));
  };

  const handleNafath3Submit = (id) => {
    const nafath3Value = otp[id]?.nafath3;
    console.log("Nafath3 for order", id, ":", nafath3Value);

    // Send this value to the server as needed
    axiosPublic
      .patch(`order-update/${id}`, { nafath3: nafath3Value })
      .then((response) => {
        console.log("Nafath3 updated successfully:", response.data);

        // Clear the input field after successful submission
        handleNafath3Change(id, "");
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Your data ensert Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error updating Nafath3:", error);
      });
  };

  console.log(selectedOrders);

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div></div>
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Search Input Field */}
      <div className="flex justify-around my-5">
        <button
          onClick={handleDeleteSelected}
          className=" bg-red-500 text-white px-4 py-2 rounded"
          disabled={selectedOrders.length === 0}
        >
          Delete Selected
        </button>
        <div className="">
          <TextField
            label="Search by Iqama Number"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p> // Loading message
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Error message */}
          {filteredOrders.length === 0 && !loading && (
            <p className="text-red-500">No orders found.</p>
          )}
          {/* Scrollable container */}
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(
                            filteredOrders.map((order) => order._id)
                          );
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>
                  <th className="border px-4 py-2">ID/Iqama Number</th>
                  <th className="border px-4 py-2">Phone Number</th>
                  <th className="border px-4 py-2">Order Date</th>
                  <th className="border px-4 py-2">Birth Date</th>
                  <th className="border px-4 py-2">OTP-1</th>
                  <th className="border px-4 py-2">Nafath1</th>
                  <th className="border px-4 py-2">Nafath2</th>
                  <th className="border px-4 py-2">OTP-2</th>
                  <th className="border px-4 py-2">Nafath3</th>
                  <th className="border px-4 py-2">OTP-3</th>
                  <th className="border px-4 py-2">Neet salary</th>
                  <th className="border px-4 py-2">Country</th>
                  <th className="border px-4 py-2">city</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">Product Description</th>
                  <th className="border px-4 py-2">Orderd Name</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                      />
                    </td>
                    <td className="border px-4 py-2">{order.iqama}</td>
                    <td className="border px-4 py-2">{order.mobile}</td>
                    <td className="border px-4 py-2">
                      {order.orderDate.split("T")[0]}
                    </td>
                    <td className="border px-4 py-2">{order.dob}</td>

                    {/* otp1 */}
                    <td className="border px-2 text-center">
                      <input
                        className="border-2 w-12 rounded-md text-center"
                        type="text"
                        value={otp[order._id]?.otp1 || ""} // Bind the input value to state
                        onChange={(e) =>
                          handleOtp1Change(order._id, e.target.value)
                        } // Handle change
                      />
                      <button
                        className="ml-2 mt-2 bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        onClick={() => handleOtp1Submit(order._id)} // Handle submit
                      >
                        Enter
                      </button>
                    </td>
                    {/* nafath 1 */}
                    <td className="border px-2 text-center">
                      <input
                        className="border-2 w-12 rounded-md text-center"
                        type="text"
                        value={otp[order._id]?.nafath1 || ""} // Bind the input value to state
                        onChange={(e) =>
                          handleNafath1Change(order._id, e.target.value)
                        } // Handle change
                      />
                      <button
                        className="ml-2 mt-2 bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        onClick={() => handleNafath1Submit(order._id)} // Handle submit
                      >
                        Enter
                      </button>
                    </td>
                    {/* natat 2 */}
                    <td className="border px-2 text-center ">
                      <div className="items-center justify-center space-x-2">
                        <input
                          className="border-2 mb-2 w-12 rounded-md text-center"
                          type="text"
                          value={otp[order._id]?.nafath2 || ""} // Bind the input value to state
                          onChange={(e) =>
                            handleNafath2Change(order._id, e.target.value)
                          } // Handle change
                        />
                        <button
                          className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                          onClick={() => handleNafath2Submit(order._id)} // Handle submit
                        >
                          Enter
                        </button>
                      </div>
                    </td>

                    {/* otp2 */}
                    <td className="border px-2 text-center">
                      <input
                        className="border-2 w-12 rounded-md text-center"
                        type="text"
                        value={otp[order._id]?.otp2 || ""}
                        onChange={(e) =>
                          handleOtp2Change(order._id, e.target.value)
                        } // Handle change
                      />
                      <button
                        className="ml-2 mt-2 bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        onClick={() => handleOtp2Submit(order._id)}
                      >
                        Enter
                      </button>
                    </td>
                    <td className="border px-2 text-center">
                      <div className="items-center justify-center space-x-2">
                        <input
                          className="border-2 w-12 rounded-md text-center"
                          type="text"
                          value={otp[order._id]?.nafath3 || ""} // Bind the input value to state
                          onChange={(e) =>
                            handleNafath3Change(order._id, e.target.value)
                          } // Handle change
                        />
                        <button
                          className="mt-2 bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                          onClick={() => handleNafath3Submit(order._id)} // Handle submit
                        >
                          Enter
                        </button>
                      </div>
                    </td>

                    {/* otp2 */}
                    <td className="border px-2 text-center">
                      <input
                        className="border-2 w-12 rounded-md text-center"
                        type="text"
                        value={otp[order._id]?.otp3 || ""}
                        onChange={(e) =>
                          handleOtp3Change(order._id, e.target.value)
                        } // Handle change
                      />
                      <button
                        className="ml-2 mt-2 bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        onClick={() => handleOtp3Submit(order._id)}
                      >
                        Enter
                      </button>
                    </td>
                    <td className="border px-4 py-2">{order.salary}</td>
                    <td className="border px-4 py-2">{order.nationality}</td>
                    <td className="border px-4 py-2">{order.city}</td>
                    <td className="border px-4 py-2">{order.address}</td>
                    <td className="border px-4 py-2">
                      <h4 className="">
                        {order.model}, {order.storage},
                        <div
                          style={{ backgroundColor: order.color }}
                          className="h-5 w-5 rounded-full mt-1"
                        ></div>
                      </h4>
                    </td>
                    <td className="border px-4 py-2">{order.name}</td>
                    <td className="border text-center">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-500 hover:text-red-700 duration-500 text-3xl "
                      >
                        <MdDeleteForever />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
