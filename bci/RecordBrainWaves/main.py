import pandas as pd
import time
from brainflow.board_shim import BoardShim, BrainFlowInputParams, LogLevels, BoardIds

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


    board.prepare_session()
    board.start_stream()

    keep_alive = True

    # open csv file to store data
    with open(filename, 'w') as f:

        # TODO: write header to csv file 32 columns for 32 channels

        records = 0

        while keep_alive == True:

            while board.get_board_data_count() < 1:  # ensures that at least one item is logged
                time.sleep(0.005)
            data = board.get_current_board_data(board.get_board_data_count())
            board.stop_stream()
            board.start_stream()
            # print out dimensions of the data
            records += 1
            print ('records', records)
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

