"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { getItem } from "@/lib/localStorage";
import { sendMessage } from "@/Hooks/api/message.api";
import { useParams } from "next/navigation";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const MessageModal = ({ isOpen, onClose, userId }: MessageModalProps) => {
  const { id: propertyId } = useParams();
  const [token, setToken] = useState<string | undefined>(undefined);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<{ message: string }>();

  useEffect(() => {
    if (isOpen) {
      setToken(getItem("token"));
    }
  }, [isOpen]);

  // Initialize sendMessage hook
  const { mutate, isPending } = sendMessage(token, userId, !!token);

  const onSubmit = (data: { message: string }) => {
    // Prepare payload with optional propertyId
    const payload: any = { message: data.message };
    if (propertyId) payload.propertyId = propertyId;

    mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[90%] sm:w-[500px] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold text-[#212B36] mb-4">Message</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm text-[#5F5F5F] mb-2"
            >
              Message
            </label>
            <Controller
              name="message"
              control={control}
              defaultValue=""
              rules={{ required: "Message is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="I'm interested in this property..."
                  className="w-full px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              )}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isPending}
              className={`w-full font-medium py-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                isPending
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-primary-blue text-white hover:bg-transparent hover:text-primary-blue border border-primary-blue"
              }`}
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
