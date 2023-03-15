import pandas as pd
from matplotlib import style
from matplotlib.animation import FuncAnimation
import matplotlib.pyplot as plt
import matplotlib
import time
import sys
import brainflow
import numpy as np
from brainflow.board_shim import BoardShim, BrainFlowInputParams, LogLevels, BoardIds
from brainflow.data_filter import DataFilter, FilterTypes, AggOperations
from brainflow.ml_model import MLModel, BrainFlowMetrics, BrainFlowClassifiers, BrainFlowModelParams

# generate csv file name
filename = time.strftime("%Y%m%d-%H%M%S")
filename = "eeg_data" + filename + ".csv"

def main(i):
    BoardShim.enable_dev_board_logger()
    BoardShim.disable_board_logger()  # optional. take this out for initial setup for your board.

    # use synthetic board for demo
    params = BrainFlowInputParams()
    board_id = BoardIds.SYNTHETIC_BOARD.value
    board = BoardShim(board_id, params)
    eeg_channels = BoardShim.get_eeg_channels(board_id)
    sampling_rate = BoardShim.get_sampling_rate(board_id)
    timestamp = BoardShim.get_timestamp_channel(board_id)

    board.prepare_session()
    board.start_stream()
    style.use('fivethirtyeight')
    plt.title("Live EEG stream from Brainflow", fontsize=15)
    plt.ylabel("Data in millivolts", fontsize=15)
    plt.xlabel("\nTime", fontsize=10)
    keep_alive = True

    eeg1 = []  # lists to store eeg data
    eeg2 = []
    eeg3 = []
    eeg4 = []
    timex = []  # list to store timestamp



    # open csv file to store data
    with open(filename, 'w') as f:

        # TODO: write header to csv file 32 columns for 32 channels

        while keep_alive == True:

            while board.get_board_data_count() < 1:  # ensures that at least one item is logged
                time.sleep(0.005)
            data = board.get_current_board_data(board.get_board_data_count())
            board.stop_stream()
            board.start_stream()
            # print out dimensions of the data
            print ('shape', data.shape)
            # create a string to save to csv
            data_string = ""
            number_of_rows = data.shape[1]

            for i in range(0, number_of_rows):
                for j in range(0, 31):
                    data_string += str(data[j][i]) + ","
                data_string += str(data[31][i]) + "\n"
                f.writelines(data_string)
                data_string = ""



    board.stop_stream()
    board.release_session()


ani = FuncAnimation(plt.gcf(), main,
                    interval=1000)  # this essentially calls the function several times until keyboard interrupt
plt.tight_layout()
plt.autoscale(enable=True, axis="y", tight=True)
plt.show()